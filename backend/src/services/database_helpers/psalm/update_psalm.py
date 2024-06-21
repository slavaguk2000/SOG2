from sqlalchemy import delete
from sqlalchemy.orm import Session

from src.models.couplet import Couplet
from src.models.couplet_content import CoupletContent
from src.models.couplet_content_chord import CoupletContentChord
from src.models.psalm import Psalm
from src.services.database import engine


def update_psalm_attributes(psalm: Psalm, psalm_data: dict):
    psalm.name = psalm_data['psalm']['name']
    psalm.psalm_number = psalm_data['psalm']['psalm_number']
    psalm.default_tonality = psalm_data['psalm']['default_tonality']


def get_chord(content_data: dict, session: Session):
    chord_data = content_data['chord']
    chord_id = chord_data['id']
    chord_template = chord_data['chord_template']
    root_note = chord_data['root_note']
    bass_note = chord_data.get('bass_note')

    chord = session.query(CoupletContentChord).filter_by(id=chord_id).one_or_none()
    if chord:
        chord.chord_template = chord_template
        chord.root_note = root_note
        chord.bass_note = bass_note
    else:
        chord = CoupletContentChord(
            id=chord_id,
            chord_template=chord_template,
            root_note=root_note,
            bass_note=bass_note,
        )
    return chord


def delete_removed_couplet_content(session: Session, existing_couplet_content_ids: [str], new_couplet_content_ids: [str]):
    for content_id in existing_couplet_content_ids - new_couplet_content_ids:
        content = session.query(CoupletContent).filter_by(id=content_id).one()
        session.delete(content)


def delete_unused_chords(session: Session, existing_chords_ids: [str]):
    session.execute(
        delete(CoupletContentChord)
        .where(
            CoupletContentChord.id.in_(existing_chords_ids),
            ~CoupletContentChord.couplet_contents.any()
        )
    )


def update_couplets(psalm: Psalm, psalm_data: dict, session: Session):
    existing_couplet_content_ids = {content.id for couplet in psalm.couplets for content in couplet.couplet_content}
    existing_chords_ids = {content.chord.id for couplet in psalm.couplets for content in couplet.couplet_content}

    new_couplet_content_ids = set()

    for couplet_data in psalm_data['couplets']:
        couplet_id = couplet_data['id']

        couplet = next((c for c in psalm.couplets if c.id == couplet_id), None)
        if not couplet:
            couplet = Couplet(id=couplet_id, marker=couplet_data['marker'], initial_order=couplet_data['initial_order'])
            psalm.couplets.append(couplet)

        couplet.marker = couplet_data['marker']
        couplet.styling = couplet_data['styling']
        couplet.initial_order = couplet_data['initial_order']

        for i, content_data in enumerate(couplet_data['couplet_content']):
            content_id = content_data['id']
            new_couplet_content_ids.add(content_id)

            chord = get_chord(content_data, session)

            content = next((c for c in couplet.couplet_content if c.id == content_id), None)
            if not content:
                content = CoupletContent(id=content_id, chord=chord, couplet=couplet)
                couplet.couplet_content.append(content)
            else:
                content.chord = chord
            content.order = i

            content.text_content = content_data['text']
            content.line = content_data['line']

    delete_removed_couplet_content(session, existing_couplet_content_ids, new_couplet_content_ids)
    delete_unused_chords(session, existing_chords_ids)


def update_psalm_in_db(session: Session, psalm_data: dict):
    psalm_id = psalm_data['psalm']['id']

    psalm = session.query(Psalm).filter_by(id=psalm_id).one()

    update_psalm_attributes(psalm, psalm_data)

    update_couplets(psalm, psalm_data, session)

    session.commit()


def update_psalm(psalm_data: dict):
    with Session(engine) as session:
        update_psalm_in_db(session, psalm_data)

    return psalm_data

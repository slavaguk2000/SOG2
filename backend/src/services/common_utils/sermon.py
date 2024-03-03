from datetime import datetime


def get_sermon_date_string_from_datetime(datetime_object: datetime):
    return f"{datetime_object.strftime('%y')}-{'{:02d}'.format(datetime_object.month)}{'{:02d}'.format(datetime_object.day)}"

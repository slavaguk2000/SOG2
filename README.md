# Song of God 2

This project will be used to show Bible and psalm slides on projectros in churches.

## dev deployment

1. Download and install elasticsearch: 

`https://www.elastic.co/downloads/elasticsearch`

2. Download and install python3:

`https://www.python.org/downloads/`

3. Install JDK and add JAVA_HOME enviroment variable

4. Run elasticsearch and ensure it works.

`https://www.youtube.com/watch?v=qgjsD5kCrFo&t=390s&ab_channel=CodeWithArjun`

5. Go to `elasticsearch_folder/config` and change in `elasticsearch.yml` from
```
xpack.security.enabled: true

xpack.security.enrollment.enabled: true
```
to 
```
xpack.security.enabled: false

xpack.security.enrollment.enabled: false
```

5. Run `simple_parser.py` in `development helper scripts` folder.

6. Run `install.sh` or `install.bat` in `backend/` folder.

7. Run `npm i` in `frontend/react/sog2/` folder.

## dev run

1. Run `start_backend.sh` or `start_backend.bat` in `backend/` folder.

2. Run `npm start` in `frontend/react/sog2/` folder.
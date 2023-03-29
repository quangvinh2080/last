# Last

Task reminders, measure by the last time you did them

![image](https://user-images.githubusercontent.com/9901814/224982609-29fefdfc-2e07-4bdb-8413-729b28c2b191.png)
![image](https://user-images.githubusercontent.com/9901814/226168967-95b57a0a-e341-4deb-8631-eb48f6dd2a65.png)
![image](https://user-images.githubusercontent.com/9901814/226168991-75a3816d-ef55-44f2-98b4-9144cac20aa8.png)



## Setup

**Clone the project**

```
git clone https://github.com/quangvinh2080/last.git
cd last
```

**Setup backend**

```
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Setup frontend**

```
cd frontend
npm install
```

**Get service-account.json**

- Enable `Google Sheets API`
- Create a new service account
- Download its json file
- Rename the file to `service-account.json` and place the file `service-account.json` in the backend folder

**Create .env file**
- Clone `.env.example` file in frontend and backend folder to `.env` file
- Update URI to your mongodb instance

## Development

**Start backend**

```
cd backend
uvicorn main:app --reload
```

**Start frontend**

```
cd frontend
npm start
```

## Production

**Build frontend**

```
npm run build
```

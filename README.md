# surge-global-back-end

#Steps to serve the back-end api

~requirements~
1. PostMan for testing
2. Acive internet connection

~Installation~
1. cd into project folder
2. npm install dependencies
3. npm run to serve in localhost 5000

#Security vulnanrabilities
**I have used mongo-db as the data base and has exposed a user account in git-hub. It will be live for a small period of time and it was kept unattended only as a demo.

#End-points
user login : `http://localhost:5000/api/signIn` || POST
user Signup: `http://localhost:5000/api/signUp` || POST
Create Todo-Items: `http://localhost:5000/api/createTodo` || POST || Auth Token(Bearer :Token)
Update Todo-Items: `http://localhost:5000/api/updateToDoItems/<Todo-item:Id>` || PATCH || Auth Token(Bearer :Token)
Get Todo-Items: `http://localhost:5000/api/deleteTodo/<User:Id>` || GET || Auth Token(Bearer :Token)
Delete Todo-Items: `http://localhost:5000/api/deleteTodo/<Todo-item:Id>` || DELETE || Auth Token(Bearer :Token)

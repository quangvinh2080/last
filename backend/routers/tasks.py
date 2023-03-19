from fastapi import APIRouter, Request, Body, status, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, Response
from typing import List
from models import TaskBase, TaskUpdate
from authentication import AuthHandler
import gspread

router = APIRouter()

# instantiate the Auth Handler
auth_handler = AuthHandler()

@router.get('/', response_description="Get all tasks")
async def get_tasks(request: Request, userId=Depends(auth_handler.auth_wrapper)):
  query = { "user_id": userId }
  
  sheet = await request.app.mongodb["googlesheets"].find_one(query)

  if sheet is None:
    full_query = (
      request.app.mongodb["tasks"]
      .find(query)
    )

    results = [TaskBase(**raw_task) async for raw_task in full_query]
    return results
  else:
    gc = gspread.service_account(filename='./service-account.json')
    sh = gc.open_by_key(sheet["spreadsheet_id"])
    wks = sh.sheet1
    list_of_lists = wks.get_all_values()
    tasks = []
    for list_index, list_values in enumerate(list_of_lists):
      if list_index == 0:
        continue
      else:
        task = {}
        for value_index, value in enumerate(list_values):
          header = list_of_lists[0][value_index]
          if header == "Name":
            task["name"] = value
          elif header == "Description":
            task["description"] = value
          elif header == "ExpectedDays":
            task["expected_days"] = value
          elif header == "LatestDate":
            task["latest_date"] = value
        task["_id"] = list_index

        tasks.append(task)

    return tasks

@router.post("/", response_description="Add a task")
async def add_task(request: Request, newTask: TaskBase = Body(...), userId=Depends(auth_handler.auth_wrapper)):
  newTask.user_id = userId
  newTask = jsonable_encoder(newTask)

  query = { "user_id": userId }
  sheet = await request.app.mongodb["googlesheets"].find_one(query)

  if sheet is None:
    task = await request.app.mongodb["tasks"].insert_one(newTask)
    created_task = await request.app.mongodb["tasks"].find_one(
      {"_id": task.inserted_id}
    )
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_task)
  else:
    gc = gspread.service_account(filename='./service-account.json')
    sh = gc.open_by_key(sheet["spreadsheet_id"])
    wks = sh.sheet1
    list_of_lists = wks.get_all_values()
    wks.append_row([
      newTask["name"],
      newTask["description"],
      newTask["expected_days"],
      newTask["latest_date"],
      "=TODAY() - D:D",
      "=C:C - E:E",
      ""
    ]
    , value_input_option='USER_ENTERED')

    task_response = newTask
    task_response["_id"] = len(list_of_lists)

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=task_response)

@router.patch("/{id}", response_description="Update task")
async def update_task(
  id: str,
  request: Request,
  task: TaskUpdate = Body(...),
  userId=Depends(auth_handler.auth_wrapper),
):
  query = { "user_id": userId }
  sheet = await request.app.mongodb["googlesheets"].find_one(query)
  if sheet is None:

    findTask = await request.app.mongodb["tasks"].find_one({"_id": id})
    if not findTask:
      raise HTTPException(status_code=404, detail=f"Task with {id} not found")

    if (findTask["user_id"] != userId):
      raise HTTPException(
        status_code=401, detail="Only the owner can update the task"
      )
    
    await request.app.mongodb["tasks"].update_one(
      {"_id": id}, {"$set": task.dict(exclude_unset=True)}
    )

    if (task := await request.app.mongodb["tasks"].find_one({"_id": id})) is not None:
      return TaskBase(**task)
  else:
    task = jsonable_encoder(task) 
    gc = gspread.service_account(filename='./service-account.json')
    sh = gc.open_by_key(sheet["spreadsheet_id"])
    wks = sh.sheet1
    row_to_update = int(id) + 1
    wks.update("A" + str(row_to_update) + ":G" +  str(row_to_update), [[
      task["name"],
      task["description"],
      task["expected_days"],
      task["latest_date"],
      "=TODAY() - D:D",
      "=C:C - E:E",
      ""
    ]], raw=False)

    return JSONResponse(status_code=status.HTTP_200_OK, content=task)

@router.delete("/{id}", response_description="Delete task")
async def delete_task(
   id: str,
   request: Request,
   userId=Depends(auth_handler.auth_wrapper),
):
  query = { "user_id": userId }
  sheet = await request.app.mongodb["googlesheets"].find_one(query)

  if sheet is None:
    findTask = await request.app.mongodb["tasks"].find_one({"_id": id})
    if not findTask:
      raise HTTPException(status_code=404, detail=f"Task with {id} not found")

    if findTask["user_id"] != userId:
      raise HTTPException(
        status_code=401, detail="Only the owner can delete the task"
      )
    delete_result = await request.app.mongodb["tasks"].delete_one({"_id": id})
    if delete_result.deleted_count == 1:
      return Response(status_code=status.HTTP_204_NO_CONTENT)
  else:
    gc = gspread.service_account(filename='./service-account.json')
    sh = gc.open_by_key(sheet["spreadsheet_id"])
    wks = sh.sheet1
    wks.delete_row(int(id) + 1)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

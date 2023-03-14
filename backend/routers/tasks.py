from fastapi import APIRouter, Request, Body, status, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, Response
from typing import List
from models import TaskBase, TaskUpdate
from authentication import AuthHandler

router = APIRouter()

# instantiate the Auth Handler
auth_handler = AuthHandler()

@router.get('/', response_description="Get all tasks")
async def get_tasks(request: Request, userId=Depends(auth_handler.auth_wrapper)) -> List[TaskBase]:
  query = { "user_id": userId }
  full_query = (
    request.app.mongodb["tasks"]
    .find(query)
  )

  results = [TaskBase(**raw_task) async for raw_task in full_query]
  return results


@router.post("/", response_description="Add a task")
async def add_task(request: Request, newTask: TaskBase = Body(...), userId=Depends(auth_handler.auth_wrapper)) -> TaskBase:
  newTask.user_id = userId
  newTask = jsonable_encoder(newTask)

  task = await request.app.mongodb["tasks"].insert_one(newTask)
  created_task = await request.app.mongodb["tasks"].find_one(
		{"_id": task.inserted_id}
  )
  return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_task)

@router.patch("/{id}", response_description="Update task")
async def update_task(
  id: str,
  request: Request,
  task: TaskUpdate = Body(...),
  userId=Depends(auth_handler.auth_wrapper),
):
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

@router.delete("/{id}", response_description="Delete task")
async def delete_task(
   id: str,
   request: Request,
   userId=Depends(auth_handler.auth_wrapper),
):
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

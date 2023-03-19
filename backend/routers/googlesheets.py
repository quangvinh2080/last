from fastapi import APIRouter, Request, Depends, status, Body
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from models import GoogleSheetsBase, PermissionFormBase, TaskBase
from authentication import AuthHandler
import gspread
import json

router = APIRouter()

# instantiate the Auth Handler
auth_handler = AuthHandler()

@router.get('/', response_description="Get google sheets integration")
async def get_sheets(request: Request, userId=Depends(auth_handler.auth_wrapper)) -> GoogleSheetsBase:
  query = { "user_id": userId }
  sheet = await request.app.mongodb["googlesheets"].find_one(query)
  return JSONResponse(status_code=status.HTTP_200_OK, content=sheet)


@router.post('/share_permission')
async def create_and_share_permissions(
  request: Request,
  userId=Depends(auth_handler.auth_wrapper),
  permissionForm: PermissionFormBase = Body(...)
):
  query = { "user_id": userId }
  sheet = await request.app.mongodb["googlesheets"].find_one(query)
  sh = None
  gc = gspread.service_account(filename='./service-account.json')

  if sheet is None:
    # Create spreadsheet with default template and existing data
    sh = gc.create("Last Time")
    wks = sh.sheet1
    wks.update('A1', [["Name", "Description", "ExpectedDays",	"LatestDate", "PassedDays", "RemainingDays", "Notes"]])
    wks.format('A1:G1', {'textFormat': {'bold': True}})

    new_google_sheet = GoogleSheetsBase(
      spreadsheet_id=sh.id
    )

    # [Get tasks]
    queue_task = { "user_id": userId }
    full_query = (
      request.app.mongodb["tasks"]
      .find(queue_task)
    )

    tasks = [TaskBase(**raw_task) async for raw_task in full_query]
    # [End get tasks]

    # [Initialize task's rows]
    for taskModel in tasks:
      task = json.loads(taskModel.json())
      wks.append_row([
        task["name"],
        task["description"],
        task["expected_days"],
        task["latest_date"],
        "=TODAY() - D:D",
        "=C:C - E:E",
        ""
      ], value_input_option='USER_ENTERED')
    # [End initialize task's rows]

    new_google_sheet.user_id = userId
    new_google_sheet = jsonable_encoder(new_google_sheet)
    await request.app.mongodb["googlesheets"].insert_one(new_google_sheet)
  else:
    sh = gc.open_by_key(sheet["spreadsheet_id"])

  sh.share(permissionForm.email, perm_type='user', role='writer')

  return JSONResponse(status_code=status.HTTP_200_OK, content={ "id": sh.id })

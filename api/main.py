from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from typing import Optional
from helper_functions import load_json, get_box_data
import json

app = FastAPI()
#app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/get_data")
def get_data():
    
    regio_json = load_json('static/regio.json')
    brieven_json = load_json('static/brieven.json')    
    box_data = get_box_data(regio_json)
    return {
        'regios'    : regio_json,
        'brieven'   : brieven_json
        }


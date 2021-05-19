import json

def load_json(file):
    with open(file, 'r') as f:
        data = json.load(f)
    return data

def get_box_data(regio_json):
    regio_namen = []

    for regio in regio_json:
        regio_namen.append(regio['naam_ext'])
    
    return regio_namen



from pymongo import MongoClient
import pandas as pd
import json
import sys

mongoUser = ''
mongoPassword = ''
mongoDB = ''

Host = 'dcccluster.uab.es'
Port = 8200
## Creamos el string de conexión a MongoDB con el host y el Port que pusimos.
DSN = "mongodb://{}:{}".format(Host, Port)
## especificamos el nombre de la BD y usamos el MongoClient
conn = MongoClient(DSN)
bd = conn["projecte"]
##"verificamos con el "--delete_all" si pasaron los argumentos y "--bd" para eliminar la base de datos especificada en el argumento siguiente
try:
    if sys.argv[3] == "--delete_all" and sys.argv[4] == "--bd":
        conn.drop_database(sys.argv[5])
        print("S'ha eliminat correctament la base de dades", sys.argv[5])
except:
    pass
## Se verifica si paso un archivo de Excel como argumento o no.
try:
    file = sys.argv[2]
    if file is not None:
          ## Se leen los datos de la hoja "Colleccions-Publicacions" del archivo de Excel y lo transformamos a JSON.
        coll_pub = pd.read_excel(file, sheet_name="Colleccions-Publicacions")
        coll_pub = coll_pub.to_json(orient='records')
        coll_pubjson = json.loads(coll_pub)
        try:
            coll = bd.create_collection("coll_pub")
        except:
            coll = bd["coll_pub"]
        for doc in coll_pubjson:
            if coll.find_one(doc) is None:
                coll.insert_one(doc)

        personatges = pd.read_excel(file, sheet_name="Personatges")
        personatges = personatges.to_json(orient='records')
        personatgesjson = json.loads(personatges)
        try:
            coll = bd.create_collection("personatges")
        except:
            coll = bd["personatges"]
        for doc in personatgesjson:
            if coll.find_one(doc) is None:
                coll.insert_one(doc)

        artistes = pd.read_excel(file, sheet_name="Artistes")
        artistes = artistes.to_json(orient='records')
        artistesjson = json.loads(artistes)
        try:
            coll = bd.create_collection("artistes")
        except:
            coll = bd["artistes"]
        for doc in artistesjson:
            if coll.find_one(doc) is None:
                coll.insert_one(doc)

        print("S'han insertat totes les dades correctament a la base de dades.")
except:
    print("No has passat cap arxiu de dades o el tipus és incorrecte")
##Ceramos la conexion a MongoDB        
conn.close()

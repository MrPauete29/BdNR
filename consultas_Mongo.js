use projecte
//1
db.coll_pub.aggregate([
    {$match: {}},
    {$sort: {preu: -1}},
    {$project: {"titol": 1,"preu":1,"_id":0}},
    {$limit: 5}
    ])
//2

db.coll_pub.aggregate([
    {$match: {"NomEditorial": "Juniper Books"}},
    {$group: {
        _id: "$NomEditorial",
        precio_max : {$max: "$preu"},
        precio_min : {$min: "$preu"},
        preu_mitja : {$avg: "$preu"}    
    }}
    ])
//3

db.coll_pub.aggregate([
  {$addFields: {"dibuixants": { $trim: {input:"$dibuixants",chars: "[]"}}}},
  {$addFields: {"dibuixants": { $split: ["$dibuixants",","] }}}, 
  {$unwind: "$dibuixants"},
  {$group: {_id:"$dibuixants",publicacions: {$sum:1}}},
  {$match: {publicacions: {$gt:5}}},
  {$project: {_id: 1}}
])

//4

db.coll_pub.aggregate([
    {$addFields: {"genere": { $trim: {input:"$genere",chars: "[]"}}}},
    {$addFields: {"genere": { $split: ["$genere",","] }}},
    {$unwind: "$genere"},
    {$group: {_id:"$NomColleccio",genere: {$addToSet: "$genere"}}},
    {$unwind: "$genere"},
    {$group: {_id: "$genere","NumColleccions": {$sum:1}}}
    ])
    
//5

db.coll_pub.aggregate([
    { $group: { _id: { NomEditorial: "$NomEditorial", NomColleccio: "$NomColleccio", tancada: "$tancada"}}},
    { $group: { _id: { NomEditorial: "$_id.NomEditorial" }, finalitzades: { $sum: { $cond: [ "$_id.tancada", 1, 0 ] } }, no_finalitzades: { $sum: { $cond: [ "$_id.tancada", 0, 1 ] } } } },
])

//6
db.coll_pub.aggregate([
    { $group: { _id: { NomEditorial: "$NomEditorial", NomColleccio: "$NomColleccio", Tancada: "$tancada" }, Publicacions: {$sum: 1}}},
    { $match: {"_id.Tancada": true}},
    { $sort: {"Publicacions":-1}},
    { $limit: 2},
    { $project: { "_id.NomEditorial":1,"_id.NomColleccio":1 }}
])

//7

db.coll_pub.aggregate([
    {$addFields: {"guionistes": { $trim: {input:"$guionistes",chars: "[]"}}}},
    {$addFields: {"guionistes": { $split: ["$guionistes",", "] }}},
    {$unwind: "$guionistes"},
    {$group: { _id: {guionistes:"$guionistes"},"Guiones": {$sum:1}}},
    {$sort: {"Guiones": -1}}, {$limit: 1},
    {$lookup: {
    from: "artistes",
    localField: "_id.guionistes",
    foreignField: "Nom_artistic" ,
    as: "artistes"}},
    {$project: {"artistes._id": 0,"artistes.cognoms":0,"artistes.data_naix":0,"artistes.nom":0,"artistes.Nom_artistic":0}}
    
    ])
    
//8

//db.personatges.find()

//db.personatges.aggregate([
    //{$group: { _id: "$isbn", tipus: {$push: "$tipus"}}},
    //{$match: { 
    //])
    
    
//9

db.coll_pub.updateMany({ stock: { $gt: 20 } }, { $mul: { preu: 1.25 } })

//10

db.coll_pub.aggregate([
    {$group: {_id: {ISBN: "$ISBN", titol: "$titol"}}},
    {$sort: {"_id.ISBN":1}},
    {$lookup: {
    from: "personatges",
    localField: "_id.ISBN",
    foreignField: "isbn" ,
    as: "personatges"}},
    {$project: {"personatges._id":0,"personatges.isbn":0}}
    ])
import pymongo

url='mongodb+srv://AlanMin:651223734@studentrecordsystem.effid.mongodb.net/'
client=pymongo.MongoClient(url)

db=client['StudentRecordSystem']
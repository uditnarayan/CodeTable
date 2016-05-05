from schema import engine, codesnippet
from sqlalchemy import update, select

def addCodeSnippet(n, c, p):
    connection = engine.connect()
    ins = codesnippet.insert(
        values=dict(name=n, code=c, pub_date=p)
    )
    result = connection.execute(ins)
    connection.close()
    return result.inserted_primary_key

def updateCodeSnippet(i, n, c):
	connection = engine.connect()
	ins = update(codesnippet).where(codesnippet.c.id == i).values(name=n, code=c)
	connection.execute(ins)
	connection.close()
	return

def getCodeSinppet(i):
    connection = engine.connect()
    ins = codesnippet.select(codesnippet.c.id == i)
    result = connection.execute(ins)
    row = result.fetchone()
    cs = None
    if row is not None:
        cs = {}
        cs["id"] = row['id']
        cs["name"] = row['name']
        cs["code"] = row['code']
        cs["pub_date"] = unicode(row['pub_date'])
    connection.close()
    return cs

def getCodeSinppets():
    connection = engine.connect()
    ins = codesnippet.select()
    result = connection.execute(ins)
    rows = result.fetchall()
    cslist = []
    for row in rows:
        cs = {}
        cs["id"] = row['id']
        cs["name"] = row['name']
        cs["code"] = row['code']
        cs["pub_date"] = unicode(row['pub_date'])
        cslist.append(cs)
    connection.close()
    return cslist
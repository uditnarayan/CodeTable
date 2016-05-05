from sqlalchemy import schema, types

metadata = schema.MetaData()

codesnippet = schema.Table('codesnippet', metadata,
    schema.Column('id', types.Integer, primary_key=True),
    schema.Column('name', types.VARCHAR(255)),
    schema.Column('code', types.Text()),
    schema.Column('pub_date', types.DATE()),
    sqlite_autoincrement=True
)
for t in metadata.sorted_tables:
    print "Table name: ", t.name

for column in codesnippet.columns:
    print "Column Table name: ", column.type

from sqlalchemy.engine import create_engine

engine = create_engine('sqlite:///codetable.db', echo=True)
metadata.bind = engine
metadata.create_all(checkfirst=True)
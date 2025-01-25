reader = open("file/AddThis.txt", "r", encoding="utf-8")
writer = open("file/updateThisFile", "a", encoding="utf-8")

writer.write(reader.read())
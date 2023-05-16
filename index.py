reader = open("file/updateThisFile", "r", encoding="utf-8")
writer = open("github-viewer.tsv", "w", encoding="utf-8")
# change this
allowanceforemptyline = 6
linkname = "link"
titlename = "title"


# dont change this
notfoundcount = 0
runcounter = 0
writer.write(f"{linkname}\t{titlename}\n")
while True:
    line = reader.readline()
    index = 0
    found = False
    for words in line:
        if words != "|":
            index += 1
            notfoundcount = 0
        else:
            found = True
            writer.write(f"{line[0:index]}\t{line[index +1:-1]}\n")
            break
    if found == False:
        if notfoundcount < allowanceforemptyline:
            # groupName not include
            writer.write("\n")
            notfoundcount += 1
            print("blank", end =" ")
        else:
            break
    runcounter += 1
    print(runcounter)
import os
import json

def tab(a, b):
    return [a, b]

fl = []

for root, dirs, files in os.walk(".", topdown=False):
    tmp = [{"file" : os.path.basename(name).split('.')[0] , "path" : os.path.join(root, name)} for name in files if name.split('.')[-1] == 'png']
    fl = tmp + fl

file= open("importAssets.json","w+")
json.dump(fl, file)
file.close()

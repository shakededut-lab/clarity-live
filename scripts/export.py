import sys
sys.path.insert(0, __import__('os').path.dirname(__file__))
from compose2 import *
OUT=sys.argv[1]
def sq(im):
    s=Image.new('RGBA',(2880,2880),(0,0,0,0)); s.alpha_composite(im.crop((0,60,2480,2940)),(200,0))
    return s.resize((640,640),Image.LANCZOS)
import json
manifest={}
for k,spec in MOODS.items():
    o=layers(spec); manifest[k]=[]
    for part in ('glow','armL','armR','face'):
        if o[part].getchannel('A').getbbox() is None: continue
        sq(o[part]).save(f'{OUT}/{k}-{part}.webp',quality=90); manifest[k].append(part)
print(json.dumps(manifest))

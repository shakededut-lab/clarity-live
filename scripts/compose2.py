from PIL import Image, ImageDraw, ImageFont, ImageFilter
import sys, json
from collections import deque
D='/mnt/project-files/clarity-live/companion/layers-v2/'
cache={}
def L(n):
    if n not in cache: cache[n]=Image.open(D+n+'.png').convert('RGBA')
    return cache[n]
def body(n):
    """Bounding box of the main glow blob (largest connected area), ignoring floating bubbles."""
    a=L(n).getchannel('A').resize((248,351))
    px=a.load(); W,H=a.size; seen=set(); best=[]
    for y in range(H):
        for x in range(W):
            if px[x,y]>150 and (x,y) not in seen:
                comp=[]; q=deque([(x,y)]); seen.add((x,y))
                while q:
                    cx,cy=q.popleft(); comp.append((cx,cy))
                    for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
                        nx,ny=cx+dx,cy+dy
                        if 0<=nx<W and 0<=ny<H and (nx,ny) not in seen and px[nx,ny]>150:
                            seen.add((nx,ny)); q.append((nx,ny))
                if len(comp)>len(best): best=comp
    xs=[p[0] for p in best]; ys=[p[1] for p in best]
    return (min(xs)*10,min(ys)*10,max(xs)*10+10,max(ys)*10+10)
def bbox_of(names):
    bs=[L(n).getchannel('A').point(lambda v:255 if v>60 else 0).getbbox() for n in names]
    return (min(b[0] for b in bs),min(b[1] for b in bs),max(b[2] for b in bs),max(b[3] for b in bs))
def place(canvas,names,src_box,dst_box,mode='fit'):
    """Move+scale a group of layers so src_box maps onto dst_box."""
    sx=(dst_box[2]-dst_box[0])/(src_box[2]-src_box[0])
    grp=Image.new('RGBA',(2480,3508),(0,0,0,0))
    for n in names: grp.alpha_composite(L(n))
    grp=grp.crop(src_box).resize((round((src_box[2]-src_box[0])*sx),round((src_box[3]-src_box[1])*sx)),Image.LANCZOS)
    canvas.alpha_composite(grp,(round(dst_box[0]),round(dst_box[1])))
ORIG=body('glow')
def new(): return Image.new('RGBA',(2480,3508),(0,0,0,0))
def layers(spec):
    """Returns separate positioned layers: glow, face, armL, armR (each full canvas)."""
    out={'glow':new(),'face':new(),'armL':new(),'armR':new()}
    out['glow'].alpha_composite(L(spec['glow']))
    b=body(spec['glow']); bw=b[2]-b[0]; bh=b[3]-b[1]; cx=(b[0]+b[2])/2; cy=(b[1]+b[3])/2
    s_=bw/(ORIG[2]-ORIG[0])
    for arm in spec.get('arms') or []:
        ab=bbox_of([arm])
        ox=cx+(ab[0]-(ORIG[0]+ORIG[2])/2)*s_; oy=cy+(ab[1]-(ORIG[1]+ORIG[3])/2)*s_
        place(out['armL' if 'left' in arm else 'armR'],[arm],ab,(ox,oy,ox+(ab[2]-ab[0])*s_,oy+(ab[3]-ab[1])*s_))
    f=spec['face']; fb=bbox_of(f); fw=fb[2]-fb[0]; fh=fb[3]-fb[1]
    tw=bw*spec.get('fw',0.42); sc=tw/fw; th=fh*sc
    fx=cx-tw/2+spec.get('dx',0)*bw; fy=cy-th/2+spec.get('dy',-0.04)*bh
    place(out['face'],f,fb,(fx,fy,fx+tw,fy+th))
    if spec.get('mouth'):
        mb=bbox_of([spec['mouth']]); mw=bw*spec.get('mw',0.1); ms=mw/(mb[2]-mb[0]); mh=(mb[3]-mb[1])*ms
        mx=fx+tw/2-mw/2+spec.get('mdx',0)*bw; my=fy+th+bh*spec.get('mgap',0.04)
        place(out['face'],[spec['mouth']],mb,(mx,my,mx+mw,my+mh))
    return out
def compose(spec):
    o=layers(spec); c=new()
    for k in ('glow','armL','armR','face'): c.alpha_composite(o[k])
    return c
MOODS={
 'energized':dict(glow='glow-bright',face=['eyes-star','mouth-grin'],arms=['arm-left-up','arm-right-up'],fw=0.46),
 'happy':dict(glow='glow',face=['face-content'],arms=['arm-left-up','arm-right-down'],fw=0.36),
 'tired':dict(glow='glow-pale',face=['eyes-sleepy'],mouth='mouth-wavy',mw=0.06,mgap=0.05,fw=0.34,dy=-0.06),
 'sad':dict(glow='glow-pale',face=['eyes-sad','mouth-sad'],arms=['arm-right-down'],fw=0.42),
 'calm':dict(glow='glow-cream',face=['face-calm'],arms=['arm-left-zen','arm-right-zen'],fw=0.34,dy=0.02),
 'scholar':dict(glow='glow-cream',face=['face-scholar'],fw=0.5,dy=-0.12),
 'curious':dict(glow='glow',face=['face-detective'],fw=0.45),
}
if __name__=='__main__':
    font=ImageFont.load_default(); W=300;H=330
    sheet=Image.new('RGB',(W*len(MOODS),H*2),'white')
    BOX=(-200,60,2680,2940)
    for i,(k,spec) in enumerate(MOODS.items()):
        im=compose(spec)
        sq=Image.new('RGBA',(2880,2880),(0,0,0,0)); sq.alpha_composite(im.crop((0,60,2480,2940)),(200,0))
        sq=sq.resize((280,280),Image.LANCZOS)
        for r,bg in enumerate([(247,231,204),(27,27,27)]):
            t=Image.new('RGB',(W,H),bg); t.paste(sq,(10,40),sq)
            ImageDraw.Draw(t).text((10,10),k,fill=(0,0,0) if r==0 else (240,240,200),font=font)
            sheet.paste(t,(i*W,r*H))
    sheet.save(sys.argv[1])

from reportlab.pdfgen import canvas
import reportlab.lib.pagesizes as pagesizes
from reportlab.platypus import Paragraph
from reportlab.lib.styles import getSampleStyleSheet

import cStringIO
styles = getSampleStyleSheet()

pagesize = pagesizes.A4
s = cStringIO.StringIO()
c = canvas.Canvas(s,pagesize=pagesize,bottomup=0)
print pagesize
c.saveState()
path = c.beginPath()
W = 100
H = 100
path.rect(0,0,W,H)
c.clipPath(path,stroke=1)
p = Paragraph('This is my sample text that goes here. Nothing else to say about it',styles['Normal'])
p.wrapOn(c,W,H)
p.drawOn(c,0,0)
c.restoreState()
# p.wrapOn(c,50,50)
c.save()
pdf = s.getvalue()
with open('test.pdf','wb') as stream:
	stream.write(pdf)
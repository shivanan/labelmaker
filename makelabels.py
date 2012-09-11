from reportlab.pdfgen import canvas
import reportlab.lib.pagesizes as pagesizes
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.styles import getSampleStyleSheet
import cStringIO

styles = getSampleStyleSheet()
class Label(object):
	def __init__(self, pagesize):
		self.stream = cStringIO.StringIO()
		self.pagesize = pagesize
		self.canvas = canvas.Canvas(self.stream,pagesize=self.pagesize,bottomup=0)
	def drawText(self,txt,x,y,w,h,style={}):
		margin = 0
		self.canvas.saveState()
		path = self.canvas.beginPath()
		path.rect(x,y,w,h)
		self.canvas.clipPath(path,stroke=1)
		_s = styles['BodyText']
		_s = ParagraphStyle({})
		_s.fontSize = style['fontSize']*1.0
		# _s.fontSize = style['fontSize']
		_s.leading = style['fontSize']
		print 'writing text',txt,x,y
		p = Paragraph(txt.strip(),_s)
		p.wrapOn(self.canvas,w-margin*2,h-margin*2)
		p.drawOn(self.canvas,x+margin,y+margin)
		self.canvas.restoreState()
	def save(self):
		self.canvas.save()
		self.stream.seek(0)
		return self.stream
		

def test():
	lbl = Label(pagesize=pagesizes.A4)
	w = pagesizes.A4[0]/4
	h = pagesizes.A4[1]/4
	x,y = 0,0
	i = 0
	print w,h
	while i < 4*4 :
		lbl.drawText('Part ' + str(x) + 'x' + str(y) + ' and about to wrap some text over here, yo',x*w,y*h,w,h)
		i += 1
		x = i%4
		y = i/4
		print i,x,y
	lbl.save()
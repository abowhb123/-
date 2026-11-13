from manim import *

class Demo(Scene):
    def construct(self):
        self.camera.background_color = "#165d4a"
        circle = Circle(radius=1.5, color="#cdb69e", fill_opacity=0.6)
        square = Square(side_length=3, color="#e6e7e8")
        title = Text("مرحباً من Manim", font="Alexandria", color="#e6e7e8").scale(0.9).to_edge(UP)
        self.play(Write(title))
        self.play(Create(square))
        self.play(Transform(square, circle))
        self.wait(0.5)

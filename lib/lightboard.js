class LightBoard
    constructor: ->
        @drawBoard()
        @board = @newBoard()
        @render()

    drawBoard: ->
        stroke 0
        background 'rgb(95, 96, 96)'
        color '#9e9f9f'
        bold true
        font 20

        #GPIO
        color white
        for _x in [0 ... 13]
            for _y in [0 ... 2]
                x = _x * 23 + 20
                y = _y * 23 + 20
                moveTo x, y
                circle 4
        
        # Letters
        moveTo 73, 88
        for letter in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
            text letter
            move 49
        moveTo 35, 112
        for letter in [1 .. 14]
            if letter is 10 then move -3
            text letter
            move 0, 28.3
    
    led: (x, y, light)-> # TODO: support
        if light is undefined or light is true then light = 7
        if light is false then light = 0
        offLED = '#7f7c78'
        onLED = '#dedbc5'
        offSolder = '#858282'
        onSolder = '#ffffff'
        x = x * 49 + 66
        y = y * 28.25 + 99
        moveTo x, y
        color mix offLED, onLED, (light / 7) * 100 + .001
        rectangle 18, 15
        color mix offSolder, onSolder, (light / 7) * 100 + .001
        move 0, 7.5
        arc 7.5, 1.5, .5, true
        move 15
        arc 7.5, .5, 1.5, true
        
    newBoard: ->
        board = new Array(8)
        for _x in [0 .. 8]
            board[_x] = new Array(13)
            for _y in [0 .. 13]
                board[_x][_y] = 0
        return board
    
    render: ->
        clear()
        @drawBoard()
        for x in [0 .. 8]
            for y in [0 .. 13]
                @led(x, y, @board[x][y])
    
    on: (location, light) -> # TODO: brightness, multiple lights
        @board[location[0]][location[1]] = light
        @render()
    
    off: (location)->
        @board[location[0]][location[1]] = 0
        @render()
    
    all: ->
        for x in [0 .. 8]
            for y in [0 .. 13]
                @board[x][y] = 7
                @render()

    
    line: (A, B, light) -> # TODO
        [x1, y1, x2, y2] = [A[0], A[1], B[0], B[1]]
        run = x2 - x1
        rise = y2 - y1
        
        m = rise / run
        adjust = if (m >= 0) then 1 else -1
        offset = 0
        threshold = 0.5
        if m <= 1 and m >= -1
            delta = Math.abs(m)
            y = y1
            for x in [x1 .. x2]
                @board[x][y] = light
                offset += delta
                if offset >= threshold
                    y += adjust
                    threshold += 1
        else
            delta = Math.abs(run / rise)
            x = x1
            for y in [y1 .. y2]
                @board[x][y] = light
                offset += delta
                if offset >= threshold
                    x += adjust
                    threshold += 1
        @render()

    rectangle: (A, B, light) ->
        for x in [A[0] .. B[0]]
            for y in [A[1] .. B[1]]
                @board[x][y] = light
                console.log(x,y)
                @render()

    ellipse: (A, B, light) -> # TODO
        @shrug()
    triangle: (A, B, C, light)-> # TODO
        @shrug()
        ###
        # Check to see if every point is greater than or less than bounding lines. Only draw in bounding box
        for x in [0 .. WIDTH]
            for y in [ 0 .. HEIGHT]
        ###
    polygon: (A, B, C, light)-> # TODO
        @shrug()
    arc: (center, start_angle, end_angle) -> # TODO
        @shrug()
    text: (location, text)-> # TODO
        @shrug()
    circle: (width, center, light) -> # TODO
        r = Math.round(width / 2)
        for x in [-r .. r]
            for y in [-r .. r]
                distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
                if (r >= distance)
                    @board[center[0] + x][center[1] + y] = light
        @render()
    scroll: (text, delay, top) -> # TODO
        @shrug()
    shrug: ->
        moveTo 250, 300
        color white
        bold true
        font 100, 'Arial'
        text '¯\\_(ツ)_/¯'
    random_loc: -> # doesn't support axis constraint
        return [random(0, 8), random(0, 13)]

# Aliases
a1 =  [0, 0]
a2 =  [0, 1]
a3 =  [0, 2]
a4 =  [0, 3]
a5 =  [0, 4]
a6 =  [0, 5]
a7 =  [0, 6]
a8 =  [0, 7]
a9 =  [0, 8]
a10 = [0, 9]
a11 = [0, 10]
a12 = [0, 11]
a13 = [0, 12]
a14 = [0, 13]
b1 =  [1, 0]
b2 =  [1, 1]
b3 =  [1, 2]
b4 =  [1, 3]
b5 =  [1, 4]
b6 =  [1, 5]
b7 =  [1, 6]
b8 =  [1, 7]
b9 =  [1, 8]
b10 = [1, 9]
b11 = [1, 10]
b12 = [1, 11]
b13 = [1, 12]
b14 = [1, 13]
c1 =  [2, 0]
c2 =  [2, 1]
c3 =  [2, 2]
c4 =  [2, 3]
c5 =  [2, 4]
c6 =  [2, 5]
c7 =  [2, 6]
c8 =  [2, 7]
c9 =  [2, 8]
c10 = [2, 9]
c11 = [2, 10]
c12 = [2, 11]
c13 = [2, 12]
c14 = [2, 13]
d1 =  [3, 0]
d2 =  [3, 1]
d3 =  [3, 2]
d4 =  [3, 3]
d5 =  [3, 4]
d6 =  [3, 5]
d7 =  [3, 6]
d8 =  [3, 7]
d9 =  [3, 8]
d10 = [3, 9]
d11 = [3, 10]
d12 = [3, 11]
d13 = [3, 12]
d14 = [3, 13]
e1 =  [4, 0]
e2 =  [4, 1]
e3 =  [4, 2]
e4 =  [4, 3]
e5 =  [4, 4]
e6 =  [4, 5]
e7 =  [4, 6]
e8 =  [4, 7]
e9 =  [4, 8]
e10 = [4, 9]
e11 = [4, 10]
e12 = [4, 11]
e13 = [4, 12]
e14 = [4, 13]
f1 =  [5, 0]
f2 =  [5, 1]
f3 =  [5, 2]
f4 =  [5, 3]
f5 =  [5, 4]
f6 =  [5, 5]
f7 =  [5, 6]
f8 =  [5, 7]
f9 =  [5, 8]
f10 = [5, 9]
f11 = [5, 10]
f12 = [5, 11]
f13 = [5, 12]
f14 = [5, 13]
g1 =  [6, 0]
g2 =  [6, 1]
g3 =  [6, 2]
g4 =  [6, 3]
g5 =  [6, 4]
g6 =  [6, 5]
g7 =  [6, 6]
g8 =  [6, 7]
g9 =  [6, 8]
g10 = [6, 9]
g11 = [6, 10]
g12 = [6, 11]
g13 = [6, 12]
g14 = [6, 13]
h1 =  [7, 0]
h2 =  [7, 1]
h3 =  [7, 2]
h4 =  [7, 3]
h5 =  [7, 4]
h6 =  [7, 5]
h7 =  [7, 6]
h8 =  [7, 7]
h9 =  [7, 8]
h10 = [7, 9]
h11 = [7, 10]
h12 = [7, 11]
h13 = [7, 12]
h14 = [7, 13]
i1 =  [8, 0]
i2 =  [8, 1]
i3 =  [8, 2]
i4 =  [8, 3]
i5 =  [8, 4]
i6 =  [8, 5]
i7 =  [8, 6]
i8 =  [8, 7]
i9 =  [8, 8]
i10 = [8, 9]
i11 = [8, 10]
i12 = [8, 11]
i13 = [8, 12]
i14 = [8, 13]

A1 =  [0, 0]
A2 =  [0, 1]
A3 =  [0, 2]
A4 =  [0, 3]
A5 =  [0, 4]
A6 =  [0, 5]
A7 =  [0, 6]
A8 =  [0, 7]
A9 =  [0, 8]
A10 = [0, 9]
A11 = [0, 10]
A12 = [0, 11]
A13 = [0, 12]
A14 = [0, 13]
B1 =  [1, 0]
B2 =  [1, 1]
B3 =  [1, 2]
B4 =  [1, 3]
B5 =  [1, 4]
B6 =  [1, 5]
B7 =  [1, 6]
B8 =  [1, 7]
B9 =  [1, 8]
B10 = [1, 9]
B11 = [1, 10]
B12 = [1, 11]
B13 = [1, 12]
B14 = [1, 13]
C1 =  [2, 0]
C2 =  [2, 1]
C3 =  [2, 2]
C4 =  [2, 3]
C5 =  [2, 4]
C6 =  [2, 5]
C7 =  [2, 6]
C8 =  [2, 7]
C9 =  [2, 8]
C10 = [2, 9]
C11 = [2, 10]
C12 = [2, 11]
C13 = [2, 12]
C14 = [2, 13]
D1 =  [3, 0]
D2 =  [3, 1]
D3 =  [3, 2]
D4 =  [3, 3]
D5 =  [3, 4]
D6 =  [3, 5]
D7 =  [3, 6]
D8 =  [3, 7]
D9 =  [3, 8]
D10 = [3, 9]
D11 = [3, 10]
D12 = [3, 11]
D13 = [3, 12]
D14 = [3, 13]
E1 =  [4, 0]
E2 =  [4, 1]
E3 =  [4, 2]
E4 =  [4, 3]
E5 =  [4, 4]
E6 =  [4, 5]
E7 =  [4, 6]
E8 =  [4, 7]
E9 =  [4, 8]
E10 = [4, 9]
E11 = [4, 10]
E12 = [4, 11]
E13 = [4, 12]
E14 = [4, 13]
F1 =  [5, 0]
F2 =  [5, 1]
F3 =  [5, 2]
F4 =  [5, 3]
F5 =  [5, 4]
F6 =  [5, 5]
F7 =  [5, 6]
F8 =  [5, 7]
F9 =  [5, 8]
F10 = [5, 9]
F11 = [5, 10]
F12 = [5, 11]
F13 = [5, 12]
F14 = [5, 13]
G1 =  [6, 0]
G2 =  [6, 1]
G3 =  [6, 2]
G4 =  [6, 3]
G5 =  [6, 4]
G6 =  [6, 5]
G7 =  [6, 6]
G8 =  [6, 7]
G9 =  [6, 8]
G10 = [6, 9]
G11 = [6, 10]
G12 = [6, 11]
G13 = [6, 12]
G14 = [6, 13]
H1 =  [7, 0]
H2 =  [7, 1]
H3 =  [7, 2]
H4 =  [7, 3]
H5 =  [7, 4]
H6 =  [7, 5]
H7 =  [7, 6]
H8 =  [7, 7]
H9 =  [7, 8]
H10 = [7, 9]
H11 = [7, 10]
H12 = [7, 11]
H13 = [7, 12]
H14 = [7, 13]
I1 =  [8, 0]
I2 =  [8, 1]
I3 =  [8, 2]
I4 =  [8, 3]
I5 =  [8, 4]
I6 =  [8, 5]
I7 =  [8, 6]
I8 =  [8, 7]
I9 =  [8, 8]
I10 = [8, 9]
I11 = [8, 10]
I12 = [8, 11]
I13 = [8, 12]
I14 = [8, 13]

On = true
ON = true

Off = false
OFF = false

True = true
False = false

WIDTH = 9
HEIGHT = 14

light = new LightBoard


# TYPE YOUR CODE HERE!
# You can delete the demo code below and use
# light.on, light.line, light.circle to draw!

# K
light.line a1, a6
light.line a3, d6
light.on b3
light.on c2
light.on d1

# A
light.line f2, f6
light.line i2, i6
light.line g1, h1
light.line g4, h4

# N
light.line a10, a14
light.line d10, d14
light.line b9, c9

# O
light.line f10, f13
light.line i10, i13
light.line g9, h9
light.line g14, h14





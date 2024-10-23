# Guitar Diagram Toolkit
Handcrafted for personal needs, provides a unique guitar diagram authoring experience for arranging music using pure guitar diagrams, inspired by Ted Greene and Tim Lerch.

## Arrangement Symbols

It's my understanding that Ted Greene was the original creator (or at least heavily popularized) his unique <a href="https://www.tedgreene.com/images/lessons/students/paulvachon/howtoreadtedgreenechorddiagrams.pdf" target="_blank">system of notation</a>.  In short, his guitar diagrams convey both a landing chord, and subsequent melody notes, before moving onto the next diagram.  Tim's original idea for how he sequenced the landing chord and following melody notes was as follows:

| Shape          | Function       |
| -------------- | -------------- |
| `Solid Circle` | chord          |
| `X`            | melody note 1  |
| `Square`       | melody note 2  |
| `Triangle`     | melody note 3  |
| `Star`         | melody note 4+ |


Having come across some books by one of Ted's former students (Tim Lerch), I took notice of a proposed change to the above symbol ordering based on the # of sides, which I found logically easier to remember.  I also decided to replace the `Star` symbol with a `Pentagon`.  My personal system is as follows:

| Shape          | Function       | # of Sides |
| -------------- | -------------- | ---------- |
| `Solid Circle` | chord          | 1          |
| `X`            | melody note 1  | 2          |
| `Triangle`     | melody note 2  | 3          |
| `Square`       | melody note 3  | 4          |
| `Pentagon`     | melody note 4+ | 5          |

## Usage

Feel free to use the currently deployed instance of my tool for your needs, link is above.  While I haven't extensively tested all browsers, preliminary testing seems consistent.  As expected, your browser may need to be granted permissions on first use if you try to download your created diagrams, or use the copy paste functionality.

## Credits
Copyright © 2024 <a href="https://github.com/christopherball" target="_blank">Christopher Ball</a><br />
License: <a href="https://github.com/christopherball/guitarDiagramToolkit/blob/main/LICENSE">MIT License</a>, Source: <a href="https://github.com/christopherball/guitarDiagramToolkit">Github</a><br />
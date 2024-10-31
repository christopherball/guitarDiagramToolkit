let currentShape = "circle";
const numStrings = 6;
const numFrets = 5;
const stringSpacing = 30;
const fretSpacing = 40;
const topMargin = 75;
const leftMargin = 50;
let validPositions = [];
let svg = null;
let existingDiagramIdToApplyAction = "";
let diagramCounter = 0;

function selectShape(shape) {
    document.querySelectorAll(".shapeSelector input").forEach((e) => {
        e.classList.remove("selected");
        if (e.getAttribute("shapeType") == shape) {
            e.classList.add("selected");
        }
    });
    currentShape = shape;
}

function createWireframe() {
    const style = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "style"
    );
    const node = document.createTextNode(
        "line, rect { shape-rendering: crispEdges; } text { font-family: 'Times New Roman', 'Times', 'Nimbus Roman 9L', serif; }"
    );
    style.appendChild(node);
    svg.appendChild(style);

    const bgRect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
    );
    bgRect.setAttribute("width", "100%");
    bgRect.setAttribute("height", "100%");
    bgRect.setAttribute("fill", "white");
    svg.appendChild(bgRect);

    const borderRect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
    );
    borderRect.setAttribute("x", "50");
    borderRect.setAttribute("y", "75");
    borderRect.setAttribute("width", "150");
    borderRect.setAttribute("height", "200");
    borderRect.setAttribute("fill", "none");
    borderRect.setAttribute("stroke", "black");
    borderRect.setAttribute("stroke-width", "1");
    svg.appendChild(borderRect);

    for (let i = 1; i < numStrings - 1; i++) {
        const x = leftMargin + i * stringSpacing;
        const string = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );
        string.setAttribute("x1", x);
        string.setAttribute("x2", x);
        string.setAttribute("y1", topMargin);
        string.setAttribute("y2", topMargin + numFrets * fretSpacing);
        string.setAttribute("stroke", "black");
        string.setAttribute("stroke-width", "1");
        svg.appendChild(string);
    }

    for (let i = 1; i <= numFrets - 1; i++) {
        const y = topMargin + i * fretSpacing;
        const fret = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );
        fret.setAttribute("x1", leftMargin);
        fret.setAttribute("x2", leftMargin + (numStrings - 1) * stringSpacing);
        fret.setAttribute("y1", y);
        fret.setAttribute("y2", y);
        fret.setAttribute("stroke", "black");
        fret.setAttribute("stroke-width", "1");
        fret.setAttribute("class", "wireframe");
        svg.appendChild(fret);
    }

    // Calculate and store valid positions (between frets for finger pressing, and above for open strings)
    for (let i = 0; i < numStrings; i++) {
        const x = leftMargin + i * stringSpacing;

        // Open string position (above the first fret line)
        validPositions.push({ x, y: topMargin - fretSpacing / 2 });

        // Positions between frets
        for (let j = 0; j < numFrets; j++) {
            const y = topMargin + (j + 0.5) * fretSpacing;
            validPositions.push({ x, y });
        }
    }
}

// Function to snap to the nearest valid position
function snapToGrid(x, y) {
    let nearest = null;
    let minDist = 10;

    // Find the closest valid position
    for (const pos of validPositions) {
        const dist = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
        if (dist < minDist) {
            minDist = dist;
            nearest = pos;
        }
    }

    return nearest;
}

function downloadBlob(blob, name = "file.txt") {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = name;
    document.body.appendChild(link);

    link.dispatchEvent(
        new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
        })
    );

    document.body.removeChild(link);
}

function copyToClipboard(value) {
    var tempInput = document.createElement("input");
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

function addCircle(x, y, tag) {
    const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
    );
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 10);
    circle.setAttribute("fill", "black");
    circle.setAttribute("erasePos", tag);
    svg.appendChild(circle);
}

function addX(x, y, tag) {
    const line1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );
    const line2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );
    line1.setAttribute("x1", x - 10);
    line1.setAttribute("y1", y - 10);
    line1.setAttribute("x2", x + 10);
    line1.setAttribute("y2", y + 10);
    line2.setAttribute("x1", x + 10);
    line2.setAttribute("y1", y - 10);
    line2.setAttribute("x2", x - 10);
    line2.setAttribute("y2", y + 10);
    line1.setAttribute("stroke", "black");
    line2.setAttribute("stroke", "black");
    line1.setAttribute("stroke-width", "2");
    line2.setAttribute("stroke-width", "2");
    line1.setAttribute("erasePos", tag);
    line2.setAttribute("erasePos", tag);
    svg.appendChild(line1);
    svg.appendChild(line2);
}

function addTriangle(x, y, tag) {
    const points = `${x},${y - 12} ${x - 11},${y + 10} ${x + 11},${y + 10}`;
    const triangle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
    );
    triangle.setAttribute("points", points);
    triangle.setAttribute("fill", "white");
    triangle.setAttribute("stroke", "black");
    triangle.setAttribute("stroke-width", "2");
    triangle.setAttribute("shape-rendering", "crispEdges");
    triangle.setAttribute("erasePos", tag);
    svg.appendChild(triangle);
}

function addSquare(x, y, tag) {
    const square = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
    );
    square.setAttribute("x", x - 10);
    square.setAttribute("y", y - 10);
    square.setAttribute("width", 20);
    square.setAttribute("height", 20);
    square.setAttribute("fill", "white");
    square.setAttribute("stroke", "black");
    square.setAttribute("stroke-width", "2");
    square.setAttribute("shape-rendering", "crispEdges");
    square.setAttribute("erasePos", tag);
    svg.appendChild(square);
}

function addPentagon(x, y, tag) {
    const pentagon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
    );

    const centerX = x;
    const centerY = y;
    const radius = 13;
    const sides = 5;
    const angle = (2 * Math.PI) / sides;

    let points = "";
    for (let i = 0; i < sides; i++) {
        const x2 = centerX + radius * Math.cos(i * angle - Math.PI / 2);
        const y2 = centerY + radius * Math.sin(i * angle - Math.PI / 2);
        points += `${x2},${y2} `;
    }

    pentagon.setAttribute("points", points.trim());
    pentagon.setAttribute("fill", "white");
    pentagon.setAttribute("stroke", "black");
    pentagon.setAttribute("stroke-width", "2");
    pentagon.setAttribute("erasePos", tag);
    svg.appendChild(pentagon);
}

function addInputConnector(startY, endY) {
    const length = 10;
    const connector1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );
    connector1.setAttribute("x1", 0);
    connector1.setAttribute("x2", length);
    connector1.setAttribute("y1", startY);
    connector1.setAttribute("y2", startY);
    connector1.setAttribute("stroke", "black");
    connector1.setAttribute("stroke-width", "1");
    connector1.setAttribute("stroke-linecap", "square");
    connector1.setAttribute("class", "connector");
    svg.appendChild(connector1);

    const connector2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );
    connector2.setAttribute("x1", length);
    connector2.setAttribute("x2", length * 2);
    connector2.setAttribute("y1", endY);
    connector2.setAttribute("y2", endY);
    connector2.setAttribute("stroke", "black");
    connector2.setAttribute("stroke-width", "1");
    connector2.setAttribute("stroke-linecap", "square");
    connector2.setAttribute("class", "connector");
    svg.appendChild(connector2);

    const bridge = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );
    bridge.setAttribute("x1", length);
    bridge.setAttribute("x2", length);
    bridge.setAttribute("y1", startY);
    bridge.setAttribute("y2", endY);
    bridge.setAttribute("stroke", "black");
    bridge.setAttribute("stroke-width", "1");
    bridge.setAttribute("class", "connector");
    svg.appendChild(bridge);
}

function addFretNumber(number, yPos) {
    let fretPos = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
    );
    fretPos.textContent = number;
    fretPos.setAttribute("text-anchor", "end");
    fretPos.setAttribute("x", "16%");
    fretPos.setAttribute("y", yPos);
    fretPos.setAttribute("font-size", "18px");
    fretPos.setAttribute("class", "fretNum");
    svg.appendChild(fretPos);
}

function addFretMarker(number, yPos, symbol) {
    if (symbol.length == 1) {
        const fretMarker = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );
        fretMarker.setAttribute("cx", "125px");
        fretMarker.setAttribute("cy", yPos);
        fretMarker.setAttribute("r", 7);
        fretMarker.setAttribute("fill", "#eeeeee");
        fretMarker.setAttribute("class", "fretMarker");
        svg.appendChild(fretMarker);
    } else {
        const fretMarker = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );
        fretMarker.setAttribute("cx", "95px");
        fretMarker.setAttribute("cy", yPos);
        fretMarker.setAttribute("r", 7);
        fretMarker.setAttribute("fill", "#eeeeee");
        fretMarker.setAttribute("class", "fretMarker");
        svg.appendChild(fretMarker);

        const fretMarker2 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );
        fretMarker2.setAttribute("cx", "155px");
        fretMarker2.setAttribute("cy", yPos);
        fretMarker2.setAttribute("r", 7);
        fretMarker2.setAttribute("fill", "#eeeeee");
        fretMarker2.setAttribute("class", "fretMarker");
        svg.appendChild(fretMarker2);
    }
}

function resetInterfaceInputs() {
    document.getElementById("chord").value = "";
    document.getElementById("fret").value = "";
    document.getElementById("inputConnector").value = "";
    document.querySelectorAll("input.stringLabels").forEach((e) => {
        e.value = "";
    });
}

// Replaces the SVG element in the editor space with the one passed in from below.
function replaceExistingDiagram(newSvgEl) {
    newSvgEl.setAttribute("width", 225);
    newSvgEl.setAttribute("height", 350);
    newSvgEl.setAttribute("id", "diagram");
    document.getElementById("diagram").replaceWith(newSvgEl);

    // Updating global svg reference.
    svg = document.getElementById("diagram");

    // Re-binding direct event listeners on the svg object(s).
    addDynamicEventListeners();

    // Resetting the interface inputs as the paste may include contradictions to typed input.
    // Not a perfect solution as I don't repopulate them but close enough.
    resetInterfaceInputs();
}

function cleanseExistingDiagram() {
    const freshSvg = document.getElementById("diagramTemplate").cloneNode(true);
    freshSvg.setAttribute("id", "diagram");
    document.getElementById("diagram").replaceWith(freshSvg);
    svg = document.getElementById("diagram");
    createWireframe();
    addDynamicEventListeners();
    resetInterfaceInputs();
}

function addStaticEventListeners() {
    document.getElementById("pasteBtn").addEventListener("click", async () => {
        const text = await navigator.clipboard.readText();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const element = doc.body.firstChild;

        if (
            element instanceof SVGElement &&
            element.hasAttribute("diagrammer")
        ) {
            replaceExistingDiagram(element);
        }
    });

    document
        .getElementById("chord")
        .addEventListener("change", function (event) {
            let tempEl = document.querySelector("svg#diagram .chordTitle");
            if (tempEl) tempEl.remove();

            let chord = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );
            chord.textContent = event.target.value;
            chord.setAttribute("text-anchor", "middle");
            chord.setAttribute("x", "125px");
            chord.setAttribute("y", "10%");
            chord.setAttribute("font-size", "24px");
            chord.setAttribute("class", "chordTitle");
            svg.appendChild(chord);
        });

    document.querySelectorAll("input.stringLabels").forEach((e) => {
        e.addEventListener("change", function (event) {
            let tempEl = document.querySelector(
                "svg#diagram .stringLabel" + event.target.id
            );
            if (tempEl) tempEl.remove();

            let stringLabel = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );
            stringLabel.textContent = event.target.value;
            stringLabel.setAttribute("text-anchor", "middle");
            stringLabel.setAttribute("y", "295");
            stringLabel.setAttribute("font-size", "16px");
            stringLabel.setAttribute("class", "stringLabel" + event.target.id);

            switch (event.target.id) {
                case "s6":
                    stringLabel.setAttribute("x", `${50}px`);
                    break;
                case "s5":
                    stringLabel.setAttribute("x", `${50 + stringSpacing}px`);
                    break;
                case "s4":
                    stringLabel.setAttribute(
                        "x",
                        `${50 + stringSpacing * 2}px`
                    );
                    break;
                case "s3":
                    stringLabel.setAttribute(
                        "x",
                        `${50 + stringSpacing * 3}px`
                    );
                    break;
                case "s2":
                    stringLabel.setAttribute(
                        "x",
                        `${50 + stringSpacing * 4}px`
                    );
                    break;
                case "s1":
                    stringLabel.setAttribute(
                        "x",
                        `${50 + stringSpacing * 5}px`
                    );
                    break;
            }

            svg.appendChild(stringLabel);
        });
    });

    document
        .getElementById("inputConnector")
        .addEventListener("change", function (event) {
            document.querySelectorAll("svg#diagram .connector").forEach((e) => {
                e.remove();
            });

            // A = 96, B = 135, C = 174, D = 213, E = 255
            const yPositions = event.target.value.split("-");
            addInputConnector(yPositions[0], yPositions[1]);
        });

    document
        .getElementById("fret")
        .addEventListener("change", function (event) {
            document
                .querySelectorAll(
                    "svg#diagram .fretNum, svg#diagram .fretMarker"
                )
                .forEach((e) => {
                    e.remove();
                });

            let fretMarkerDictionary = {
                1: "",
                2: "",
                3: "o",
                4: "",
                5: "o",
                6: "",
                7: "o",
                8: "",
                9: "o",
                10: "",
                11: "",
                12: "oo",
                13: "",
                14: "",
                15: "o",
                16: "",
                17: "o",
                18: "",
                19: "o",
                20: "",
                21: "o",
                22: "",
            };
            const fretNumStartVal = Number(event.target.value);
            if (fretNumStartVal > 0) {
                let yPos = 29;
                addFretNumber(fretNumStartVal, yPos + "%");

                if (fretMarkerDictionary[fretNumStartVal] != "") {
                    addFretMarker(
                        fretNumStartVal,
                        yPos - 2 + "%",
                        fretMarkerDictionary[fretNumStartVal]
                    );
                }

                if (fretMarkerDictionary[fretNumStartVal + 1] != "") {
                    yPos = 41;
                    addFretMarker(
                        fretNumStartVal + 1,
                        yPos - 2 + "%",
                        fretMarkerDictionary[fretNumStartVal + 1]
                    );
                }

                if (fretMarkerDictionary[fretNumStartVal + 2] != "") {
                    yPos = 52;
                    addFretMarker(
                        fretNumStartVal + 2,
                        yPos - 2 + "%",
                        fretMarkerDictionary[fretNumStartVal + 2]
                    );
                }

                if (fretMarkerDictionary[fretNumStartVal + 3] != "") {
                    yPos = 63;
                    addFretMarker(
                        fretNumStartVal + 3,
                        yPos - 2 + "%",
                        fretMarkerDictionary[fretNumStartVal + 3]
                    );
                }

                if (fretMarkerDictionary[fretNumStartVal + 4] != "") {
                    yPos = 75;
                    addFretMarker(
                        fretNumStartVal + 4,
                        yPos - 2 + "%",
                        fretMarkerDictionary[fretNumStartVal + 4]
                    );
                }
            }
        });

    document.addEventListener("keydown", function (event) {
        if (event.code === "Numpad0") {
            event.preventDefault();
            toggleDisplay("toolContainer");
        } else if (event.code === "Numpad1") {
            event.preventDefault();
            selectShape("circle");
        } else if (event.code === "Numpad2") {
            event.preventDefault();
            selectShape("x");
        } else if (event.code === "Numpad3") {
            event.preventDefault();
            selectShape("triangle");
        } else if (event.code === "Numpad4") {
            event.preventDefault();
            selectShape("square");
        } else if (event.code === "Numpad5") {
            event.preventDefault();
            selectShape("pentagon");
        } else if (event.code === "Numpad6") {
            event.preventDefault();
            selectShape("erase");
        }
    });

    document
        .getElementById("downloadBtn")
        .addEventListener("click", function (event) {
            // JSZip.min.js
            var zip = new JSZip();
            var folder = zip.folder("diagrams");
            document
                .querySelectorAll("td.chainChunk svg")
                .forEach((d, index) => {
                    folder.file("diagram" + (index + 1) + ".svg", d.outerHTML);
                });

            zip.generateAsync({ type: "blob" }).then(function (content) {
                // FileSaver.min.js
                saveAs(content, "diagrams.zip", { type: "image/svg+xml" });
            });
        });

    document.getElementById("copyBtn").addEventListener("click", () => {
        let clonedNode = document.getElementById("diagram").cloneNode(true);
        const size = document.getElementById("size").value;
        clonedNode.setAttribute("width", Math.round(225 * size));
        clonedNode.setAttribute("height", Math.round(350 * size));
        copyToClipboard(clonedNode.outerHTML);
    });
}

function toggleDisplay(elementId) {
    const element = document.getElementById(elementId);
    if (element.style.display != "none") {
        element.style.display = "none";
    } else {
        element.style.display = "block";
    }
}

function diagramMouseMoveListener(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    const snapPos = snapToGrid(x, y);

    if (snapPos != null) {
        // Change mouse cursor to signal drop zone.
        document.body.style.cursor = "pointer";
    } else {
        // Restore when not in range.
        document.body.style.cursor = "default";
    }
}

function diagramClickListener(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    const snapPos = snapToGrid(x, y);

    if (snapPos != null) {
        const { x: snappedX, y: snappedY } = snapPos;
        const tag = snappedX + "," + snappedY;

        switch (currentShape) {
            case "circle":
                addCircle(snappedX, snappedY, tag);
                break;
            case "x":
                addX(snappedX, snappedY, tag);
                break;
            case "triangle":
                addTriangle(snappedX, snappedY, tag);
                break;
            case "square":
                addSquare(snappedX, snappedY, tag);
                break;
            case "pentagon":
                addPentagon(snappedX, snappedY, tag);
                break;
            case "erase":
                document
                    .querySelectorAll("svg#diagram [erasePos='" + tag + "']")
                    .forEach((e) => {
                        e.remove();
                    });
                break;
        }
    }
}

// Inserts the diagram above down below.
function insertDiagramClickListener(event) {
    // Shifting current diagram downward.
    let wrapperEl = document.createElement("td");
    wrapperEl.classList.add("chainChunk");
    const size = document.getElementById("size").value;
    let clonedNode = svg.cloneNode(true);
    clonedNode.setAttribute("width", Math.round(225 * size));
    clonedNode.setAttribute("height", Math.round(350 * size));
    clonedNode.setAttribute("id", "diagramPreview" + diagramCounter);
    wrapperEl.appendChild(clonedNode);
    document.getElementById("previewRow").appendChild(wrapperEl);

    // Incrementing our global diagramCounter for future inserts.
    diagramCounter++;

    // Clearing current diagram for next creation.
    cleanseExistingDiagram();

    // Ensuring that the cursor is reset back to solid circles.
    selectShape("circle");

    // Disabling apply action buttons again as well as placeholder variable.
    resetApplyActionButtons();

    // Ensuring that the zip button is enabled as we have 1 or more diagrams down below now.
    document.getElementById("downloadBtn").disabled = false;
}

// Updates the diagram down below based on the id.
function updateDiagramClickListener(event) {
    // Shifting current diagram downward toward the correct digram id slot.
    const size = document.getElementById("size").value;
    let clonedNode = svg.cloneNode(true);
    clonedNode.setAttribute("width", Math.round(225 * size));
    clonedNode.setAttribute("height", Math.round(350 * size));
    clonedNode.setAttribute("id", existingDiagramIdToApplyAction);
    document
        .getElementById(existingDiagramIdToApplyAction)
        .parentNode.replaceChild(
            clonedNode,
            document.getElementById(existingDiagramIdToApplyAction)
        );

    // Clearing current diagram for next creation.
    cleanseExistingDiagram();

    // Ensuring that the cursor is reset back to solid circles.
    selectShape("circle");

    // Disabling apply action buttons again as well as placeholder variable.
    resetApplyActionButtons();
}

function deleteDiagramClickListener(event) {
    document.getElementById(existingDiagramIdToApplyAction).parentNode.remove();

    // Clearing current diagram for next creation.
    cleanseExistingDiagram();

    // Ensuring that the cursor is reset back to solid circles.
    selectShape("circle");

    // Disabling apply action buttons again as well as placeholder variable.
    resetApplyActionButtons();

    // Disabling the zip button only if we deleted the last diagram.
    if (document.querySelectorAll("td.chainChunk svg").length == 0) {
        document.getElementById("downloadBtn").disabled = true;
    }
}

function shiftLeftClickListener(event) {
    let targetTdEl = document.getElementById(
        existingDiagramIdToApplyAction
    ).parentNode;
    if (targetTdEl.previousSibling != null) {
        targetTdEl.previousSibling.insertAdjacentElement(
            "beforebegin",
            targetTdEl
        );
    }
}

function shiftRightClickListener(event) {
    let targetTdEl = document.getElementById(
        existingDiagramIdToApplyAction
    ).parentNode;
    if (targetTdEl.nextSibling != null) {
        targetTdEl.nextSibling.insertAdjacentElement("afterend", targetTdEl);
    }
}

function resetApplyActionButtons() {
    // Disabling the apply action buttons.
    document.getElementById("updateBtn").disabled = true;
    document.getElementById("deleteBtn").disabled = true;
    document.getElementById("shiftLeftBtn").disabled = true;
    document.getElementById("shiftRightBtn").disabled = true;

    // Resetting the id holder for the diagram to apply actions to.
    existingDiagramIdToApplyAction = "";
}

// Fires on the act of clicking a diagram down below to edit it or use it as a seed for a new diagram.
function diagramPreviewClickListener(event) {
    replaceExistingDiagram(event.target.parentElement.cloneNode(true));

    // Enabling the apply action buttons should that be desired.
    document.getElementById("updateBtn").disabled = false;
    document.getElementById("deleteBtn").disabled = false;
    document.getElementById("shiftLeftBtn").disabled = false;
    document.getElementById("shiftRightBtn").disabled = false;

    // Storing off the ID of the diagram in case it needs to have actions applied.
    existingDiagramIdToApplyAction = event.target.parentElement.id;
}

function addDynamicEventListeners() {
    document
        .getElementById("diagram")
        .removeEventListener("mousemove", diagramMouseMoveListener);
    document
        .getElementById("diagram")
        .addEventListener("mousemove", diagramMouseMoveListener);

    document
        .getElementById("diagram")
        .removeEventListener("click", diagramClickListener);
    document
        .getElementById("diagram")
        .addEventListener("click", diagramClickListener);

    document
        .getElementById("insertBtn")
        .removeEventListener("click", insertDiagramClickListener);
    document
        .getElementById("insertBtn")
        .addEventListener("click", insertDiagramClickListener);

    document
        .getElementById("updateBtn")
        .removeEventListener("click", updateDiagramClickListener);
    document
        .getElementById("updateBtn")
        .addEventListener("click", updateDiagramClickListener);

    document
        .getElementById("deleteBtn")
        .removeEventListener("click", deleteDiagramClickListener);
    document
        .getElementById("deleteBtn")
        .addEventListener("click", deleteDiagramClickListener);

    document
        .getElementById("shiftLeftBtn")
        .removeEventListener("click", shiftLeftClickListener);
    document
        .getElementById("shiftLeftBtn")
        .addEventListener("click", shiftLeftClickListener);

    document
        .getElementById("shiftRightBtn")
        .removeEventListener("click", shiftRightClickListener);
    document
        .getElementById("shiftRightBtn")
        .addEventListener("click", shiftRightClickListener);

    document.querySelectorAll("tr#previewRow td svg").forEach((e) => {
        e.removeEventListener("click", diagramPreviewClickListener);
    });
    document.querySelectorAll("tr#previewRow td svg").forEach((e) => {
        e.addEventListener("click", diagramPreviewClickListener);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    svg = document.getElementById("diagram");
    createWireframe();
    addStaticEventListeners();
    addDynamicEventListeners();
});

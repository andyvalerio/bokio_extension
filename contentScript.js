const targetNode = document.getElementById('root');
const config = { attributes: false, childList: true, subtree: true };
const matchProductEdit = ['Redigera rad', 'Lägg till ny rad']

const callback = function(mutationsList, observer) {
    for(const mutation of mutationsList) {
        if (mutation.addedNodes.length == 1 && mutation.addedNodes[0].innerText != undefined) {
            if (matchProductEdit.indexOf(mutation.addedNodes[0].innerText.substr(0, mutation.addedNodes[0].innerText.indexOf('\n'))) >= 0 && mutation.addedNodes[0].className === 'Xp Wp') {
                labels = document.getElementsByTagName('label')
                divToCopy = getFirstElementByText(labels, 'Totalt Exklusive VAT').parentElement
                // Add a new node with the price including VAT
                newNode = divToCopy.cloneNode(true)
                newNode.id = 'inclVat'
                newNode.childNodes[0].textContent = 'Totalt Inklusive VAT'
                divToCopy.parentElement.appendChild(newNode)
                vatSelector = divToCopy.parentElement.getElementsByTagName('select')[0]
                updatePrice(vatSelector, divToCopy, newNode)
                // Add listeners to the input textbox and the VAT selector
                vatSelector.addEventListener('change', (event) => {
                    updatePrice(vatSelector, divToCopy, newNode)
                });
                divToCopy.parentElement.parentElement.childNodes[1].getElementsByTagName('input')[0].addEventListener('keyup', (event) => {
                    updatePrice(vatSelector, divToCopy, newNode)
                });
            }
        }
    }
}

const observer = new MutationObserver(callback);

observer.observe(targetNode, config);

// Utils
function getFirstElementByText(elements, text) {
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].textContent === text) {
          return elements[i]
        }
    }
    return undefined
}

function updatePrice(vatSelector, priceDiv, newPriceDiv) {
    beforePrice = Number(replaceNbsps(priceDiv.childNodes[1].textContent).replace('kr', '').replace(',', '.'))
    vatPercentage = Number(vatSelector.selectedOptions[0].innerText.replace(' %', ''))
    tax = (vatPercentage * beforePrice) / 100
    afterPrice = beforePrice + tax
    newPriceDiv.childNodes[1].textContent = (afterPrice + ' kr').replace('.', ',')
}

function replaceNbsps(str) {
    var re = new RegExp(String.fromCharCode(160), 'g');
    return str.replace(re, '');
}
const form = document.getElementById("form")

const backdrop = document.getElementById("backdrop")
const example = document.getElementById("example")
const defaultImg = document.getElementById("defaultImg")

const contactSelector = document.getElementById("contactSelector")
const contact = document.getElementById("contact")

const selector = document.getElementById("selector")

const charCount = document.getElementById("charCount")
const bgComplexity = document.getElementById("bgComplexity")

const charText = document.getElementById("charText")
const complexityLevel = document.getElementById("complexityLevel")
const bgLevel = document.getElementById("bgLevel")
const subtotal = document.getElementById("subtotal")

var basePrice
var priceSubtotal
var finalPrice

function swapStyle(style) {
    basePrice = 0
    Array.from(backdrop.children).forEach(element => {
        
        element.classList.remove("visible");

        if (style == element.id) {
            element.classList.add("visible");
            basePrice = Number(element.alt)
            return
        }
    })
    Array.from(example.children).forEach(element => {
        element.classList.remove("visible");

        if (style == element.id) {
            element.classList.add("visible");
            return
        }
    })
}

function updatePrice() {
    const computedChar = Number(charCount.value) + 1 
    
    if (charCount.value == 1) {
        priceSubtotal = basePrice
    } else if (charCount.value == 0) {
        priceSubtotal = 0
    } else {
        priceSubtotal = (basePrice / 2) * computedChar
    }

    finalPrice = priceSubtotal + (priceSubtotal * (bgComplexity.value/100))

    if (finalPrice == 0) {
        subtotal.textContent = "Cost estimate: - €" 
    } else {
        subtotal.textContent = "Cost estimate: " + finalPrice + "€" 
    }
}

function handleContactChange() {
    if (contactSelector.value != "") {
        contact.classList.remove("hidden")
        contact.required = true
        contact.tabIndex = 0
        if (contactSelector.value == "Other email") {
            contact.type = "email"
            contact.placeholder = "Your contact email"
        } else {
            contact.type = "text"
            contact.placeholder = "Your " + contactSelector.value + " handle"
        }
    } else {
        contact.classList.add("hidden")
        contact.tabIndex = -1
        contact.value = ""
        contact.required = false
    }
}

function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.target)

    if (data.get("contactMethod") == "") {
        data.set("contactMethod", "email")
    }

    const commInfo = {
        email: data.get("email"),
        cost: {
            background: data.get("bgComplexity"),
            subtotal: priceSubtotal,
            total: finalPrice,
        },
        contact: {
            method: data.get("contactMethod"),
            handle: data.get("contact")
        },
        details: {
            style: data.get("style"),
            characters: data.get("charCount"),
            description: data.get("contentDescription"),
        }
    }

    console.log(commInfo)

    emailCommission(commInfo)
}

function emailCommission(data) {
    var to = data.email

    if (data.contact.method != "email") {
        to = data.contact.handle + " on " + data.contact.method
    }

    const subject = "Commission request for " + to

    const body = 
        "Commission request\n" +
        "\n" +
        "Payment email:\n" + data.email + "\n" +
        "\n" +
        "Style:\n" + data.details.style + "\n" +
        "Characters:\n" + data.details.characters + "\n" +
        "Description:\n" + data.details.description + "\n" +
        "\n" +
        "Subtotal: " + data.cost.subtotal + "€" + "\n" +
        "Background complexity: +" + data.cost.background + "%\n" +
        "\n" +
        "Estimated total: " + data.cost.total + "€" + "\n" +
        "\n" +
        "If everything looks correct, attach or link any character reference you may want to add " +
        "and I'll get back to you through your preferred contact method.\n" +
        "\n" +
        "This form is currently an experiment, so, if I may ask, how was it?"

    window.open(
        "mailto:zazaguichi@outlook.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body)
    )
}

function bgLabelChange() {
    switch (bgComplexity.value) {
        case "0":
            bgLevel.textContent = "Trivially easy"
            break;
        case "5":
            bgLevel.textContent = "Basic and simple"
            break;
        case "10":
            bgLevel.textContent = "A little busy"
            break;
        case "15":
            bgLevel.textContent = "Fairly busy"
            break;
        case "20":
            bgLevel.textContent = "Busy and complex"
            break;
        default:
            bgLevel.textContent = "What"
            break;
    }
}

form.addEventListener("submit", handleSubmit)

selector.addEventListener("change", () => {
    swapStyle(selector.value)
    updatePrice()
})

contactSelector.addEventListener("change", () => {
    handleContactChange()
})

charCount.addEventListener("change", () => {
    updatePrice()
})

bgComplexity.addEventListener("change", () => {
    bgLabelChange()
    complexityLevel.innerText = "+" + bgComplexity.value + "%"
    updatePrice()
})

swapStyle(selector.value)
updatePrice()
complexityLevel.innerText = "+" + bgComplexity.value + "%"
contactSelector.value = ""
handleContactChange()
bgLabelChange()

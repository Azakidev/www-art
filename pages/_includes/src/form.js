// Selectors
const form = document.getElementById("form")
// Images
const backdrop = document.getElementById("backdrop")
const example = document.getElementById("example")
const defaultImg = document.getElementById("defaultImg")
// Info
const contactSelector = document.getElementById("contactSelector")
const contactField = document.getElementById("contactField")
// Type Selector
const commissionType = document.getElementsByName("commissionType")
// Sections
const formSections = document.getElementsByClassName("formSection")
// CommissionForm
const styleSelector = document.getElementById("styleSelector")
const charCount = document.getElementById("charCount")
const contentDescription = document.getElementById("contentDescription")
const bgComplexity = document.getElementById("bgComplexity")
// Labels
const charText = document.getElementById("charText")
const complexityLevel = document.getElementById("complexityLevel")
const bgLevel = document.getElementById("bgLevel")
// LabsForm
const labsPicker = document.getElementById("labsPicker")
// YCHForm
const ychPicker = document.getElementById("ychPicker")
// Slot prompts
const litePrompt = document.getElementById("litePrompt")
const choosePrompt = document.getElementById("choosePrompt")
// Slots selectors
const liteFull = document.getElementById("liteFull")
const chooseA = document.getElementById("chooseA")
const chooseB = document.getElementById("chooseB")

// Price labels
const subtotal = document.getElementById("subtotal")

// Globals
var type
var basePrice
var priceSubtotal
var finalPrice

var rawPrice = ""
var ychType

function handleContactChange() {
    if (contactSelector.value != "") {
        contactField.classList.remove("hidden")
        contactField.required = true
        contactField.tabIndex = 0
        if (contactSelector.value == "Other email") {
            contactField.type = "email"
            contactField.placeholder = "Your contact email"
        } else {
            contactField.type = "text"
            contactField.placeholder = "Your " + contactSelector.value + " handle"
        }
    } else {
        contactField.classList.add("hidden")
        contactField.tabIndex = -1
        contactField.value = ""
        contactField.required = false
    }
}

function hideSections() {
    Array.from(formSections).forEach(section => {
        if (type.toLowerCase() + "Form" == section.id ) {
            section.classList.remove("hidden")
        } else {
            section.classList.add("hidden")
        }
    })

    // Comm required fields
    styleSelector.required = false
    contentDescription.required = false
    charCount.required = false
    // Labs required fields
    labsPicker.required = false
    // YCH required fields
    ychPicker.required = false

    switch (type) {
        case "Commission":
            styleSelector.required = true
            contentDescription.required = true
            charCount.required = true
            swapStyle(styleSelector.value)
            updateCommissionPrice()
            break;

        case "LABS":
            labsPicker.required = true
            swapStyle(labsPicker.value)
            updateLabsPrice()
            break;

        case "YCH":
            ychPicker.required = true
            swapStyle(ychPicker.value)
            updateYchPrice()
            break;
    
        default:
            swapStyle("")
            break;
    }
}

function swapStyle(style) {
    basePrice = 0
    rawPrice = " - €"
    ychType = ""

    Array.from(backdrop.children).forEach(element => {
        element.classList.remove("visible");

        if (style == element.id) {
            element.classList.add("visible");
            if (type == "Commission") {
                basePrice = Number(element.alt)
            } else {
                rawPrice = element.alt
                ychType = element.dataset.type
            }
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

function updateCommissionPrice() {
    const computedChar = Number(charCount.value) + 1

    if (charCount.value == 1) {
        priceSubtotal = basePrice
    } else if (charCount.value == 0) {
        priceSubtotal = 0
    } else {
        priceSubtotal = (basePrice / 2) * computedChar
    }

    finalPrice = priceSubtotal + (priceSubtotal * (bgComplexity.value / 100))

    if (finalPrice == 0) {
        subtotal.textContent = "Cost estimate: - €"
    } else {
        subtotal.textContent = "Cost estimate: " + finalPrice + "€"
    }
}

function updateLabsPrice() {
    subtotal.textContent = "Cost estimate: " + rawPrice
}

function updateYchPrice() {
    const firstPrice = Number(rawPrice.split("/")[0])
    const secondPrice = Number(rawPrice.split("/")[1])

    finalPrice = 0

    if (ychType == "lite") {
        litePrompt.classList.remove("hidden")
        if (liteFull.checked) { finalPrice = firstPrice + secondPrice } else { finalPrice = firstPrice }
    } else {
        litePrompt.classList.add("hidden")
    }

    if (ychType == "choose") {
        choosePrompt.classList.remove("hidden")
        if (chooseA.checked) finalPrice += firstPrice
        if (chooseB.checked) finalPrice += (secondPrice - firstPrice)
    } else {
        choosePrompt.classList.add("hidden")
    }

    if (ychType == "single") {
        finalPrice += firstPrice
    }

    if (finalPrice == 0) {
        subtotal.textContent = "Cost estimate: - €"
    } else {
        subtotal.textContent = "Cost estimate: " + finalPrice + "€"
    }
}

function handleSubmit(event) {
    event.preventDefault();

    const data = new FormData(event.target)

    if (data.get("contactMethod") == "") {
        data.set("contactMethod", "email")
    }

    const contactInfo = {
        email: data.get("email"),
        contact: {
            method: data.get("contactMethod"),
            handle: data.get("contactField")
        },
    }

    const commDetail = {
        cost: {
            subtotal: priceSubtotal,
            total: finalPrice,
        },
        details: {
            style: data.get("styleSelector"),
            characters: data.get("charCount"),
            background: data.get("bgComplexity"),
            description: data.get("contentDescription"),
        }
    }

    const labsDetail = {
        cost: {
            total: rawPrice
        },
        details: {
            item: data.get("labsPicker"),
        }
    }

    var slots
    switch (ychType) {
        case "single":
            slots = ""
            break;

        case "lite":
            slots = liteFull.checked ? "Both" : "Lite only"
            break;

        case "choose":
            if (chooseA.checked) slots += "A"
            if (chooseB.checked) slots += "B"
            break;
    
        default:
            slots = ""
            break;
    }

    const ychDetail = {
        cost: {
            total: finalPrice,
        },
        details: {
            item: data.get("ychPicker"),
            slots: slots
        }
    }

    var item
    switch (type) {
        case "Commission":
            item = commDetail
            break;

        case "LABS":
            item = labsDetail
            break;

        case "YCH":
            item = ychDetail
            break;
    
        default:
            break;
    }

    const commInfo = {
        info: contactInfo,
        item: item
    }

    console.info(commInfo)
    emailCommission(commInfo)
}

function emailCommission(data) {
    var to = data.info.email

    if (data.info.contact.method != "email") {
        to = data.info.contact.handle + " on " + data.info.contact.method
    }

    const subject = "Commission request for " + to

    var body
    switch (type) {
        case "Commission":
            body = commissionBody(data)
            break;

        case "LABS":
            body = labsBody(data)
            break;

        case "YCH":
            body = ychBody(data)
    
        default:
            break;
    }

    window.open(
        "mailto:zazaguichi@outlook.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body)
    )
}

function commissionBody(data) {
    return "Commission request\n" +
        "\n" +
        "Payment email:\n" + data.info.email + "\n" +
        "\n" +
        "Style:\n" + data.item.details.style + "\n" +
        "Characters:\n" + data.item.details.characters + "\n" +
        "Description:\n" + data.item.details.description + "\n" +
        "\n" +
        "Subtotal: " + data.item.cost.subtotal + "€" + "\n" +
        "Background complexity: +" + data.item.details.background + "%\n" +
        "\n" +
        "Estimated total: " + data.item.cost.total + "€" + "\n" +
        "\n" +
        "If everything looks correct, attach or link any character reference you may want to add " +
        "and I'll get back to you through your preferred contact method.\n" +
        "\n" +
        "This form is currently an experiment, so, if I may ask, how was it?"
}

function labsBody(data) {
    return "LABS commission request\n" +
        "\n" +
        "Payment email:\n" + data.info.email + "\n" +
        "\n" +
        "Item:\n" + data.item.details.item.split(".")[0] + "\n" +
        "\n" +
        "Estimated total: " + data.item.cost.total + "\n" +
        "\n" +
        "If everything looks correct, attach or link any character reference you may want to add " +
        "and I'll get back to you through your preferred contact method.\n" +
        "\n" +
        "This form is currently an experiment, so, if I may ask, how was it?"
}

function ychBody(data) {
    return "YCH request\n" +
        "\n" +
        "Payment email:\n" + data.info.email + "\n" +
        "\n" +
        "YCH:\n" + data.item.details.item + "\n" +
        "Slots requested:\n" + data.item.details.slots + "\n" +
        "\n" +
        "Estimated total: " + data.item.cost.total + "€" + "\n" +
        "\n" +
        "If everything looks correct, attach or link any character reference you may want to add " +
        "and I'll get back to you through your preferred contact method.\n" +
        "\n" +
        "This form is currently an experiment, so, if I may ask, how was it?"
}

function updateBgLabel() {
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
            bgLevel.textContent = "Unknown value"
            break;
    }
}

// Listeners
form.addEventListener("submit", handleSubmit)

// Contact
contactSelector.addEventListener("change", handleContactChange)

// Type picker
Array.from(commissionType).forEach(element => {
    element.addEventListener("change", () => {
        if (element.checked) {
            type = element.id
            hideSections()
        }
    })
})

// CommissionForm
styleSelector.addEventListener("change", () => {
    swapStyle(styleSelector.value)
    updateCommissionPrice()
})

charCount.addEventListener("change", updateCommissionPrice)

bgComplexity.addEventListener("change", () => {
    updateBgLabel()
    complexityLevel.innerText = "+" + bgComplexity.value + "%"
    updateCommissionPrice()
})

// LabsForm
labsPicker.addEventListener("change", () => {
    swapStyle(labsPicker.value)
    updateLabsPrice()
})

// YCHForm
ychPicker.addEventListener("change", () => {
    swapStyle(ychPicker.value)
    updateYchPrice()
})

liteFull.addEventListener("change", updateYchPrice)
chooseA.addEventListener("change", updateYchPrice)
chooseB.addEventListener("change", updateYchPrice)

// Contact init
contactSelector.value = ""
handleContactChange()

// CommissionForm Init
swapStyle(styleSelector.value)
updateCommissionPrice()
complexityLevel.innerText = "+" + bgComplexity.value + "%"
updateBgLabel()

// Picker init
Array.from(commissionType).forEach(element => {
    if (element.checked) {
        type = element.id
        hideSections()
    }
})

// LabsForm init
updateLabsPrice()

// YCHForm init
updateYchPrice()

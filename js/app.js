document.addEventListener("DOMContentLoaded", () => {
  let form = document.querySelector(".template-form");
  let textarea = document.querySelector(".editor-textarea");
  let select = document.querySelector("#select-template");
  let feedback = document.querySelector(".feedback");
  textarea.value = "";
  // show feedback to the user
  function showFeedback(className, message) {
    feedback.classList.add(className);
    feedback.textContent = message;
    feedback.style.display = "block";
    setTimeout(function () {
      feedback.classList.remove(className);
      feedback.style.display = "none";
    }, 5000);
  }
  // Data store
  let state = {
    // order confirmation
    orderConfirmation: {
      value: ``,
      search:
        /{% if line\.variant\.title != 'Default Title' %}\s*<span class="order-list__item-variant">\s*{{ line\.variant\.title }}\s*<\/span>\s*<br\/>\s*{% endif %}/gim,
      replace: `
      {% if line.variant.title != 'Default Title' %}
        <span class="order-list__item-variant">{{ line.variant.title }}
        </span>
        <br/>
      {% endif %}

      {% for p in line.properties %}   
      {% assign hidden_property = p.first | first | replace: '_', true %}
      {% unless p.last == blank %} 
      {% if p.first contains 'pdf' %}
      {% assign hidden_property = false%}
      {% assign p.first = p.first | replace: '_' %}
      {% endif %} 
      {% if hidden_property == 'true' %} 
      <span style="display:none;" class="product-personalizer-line-item-prop" data-prop-name="{{ p.first }}">{{ p.first }}: {{ p.last }}
      </span> 
      {% else %} 
      {{ p.first | replace: '_'}}: 
      {% if p.last contains '/uploads/' or p.last contains '/assets/' or p.last contains '/products/' %} 
      {% assign format = 'jpg' %}
      {% if p.last contains 'png' %}
      {% assign format = 'png' %}
      {% endif %}
      {% if p.last contains 'pdf' %}
      {% assign format = 'pdf' %}
      {% endif %}
      <a target="_blank"  href="{{ p.last }}?format={{ format }}" src="{{ p.last }}?format={{ format }}" class="jslghtbx-thmb" data-jslghtbx download>Download {{ format }} file
      </a> 
      {% else %} 
      {{ p.last | newline_to_br }} 
      {% endif %} 
      <br> 
      {% endif %} 
      {% endunless %}{% endfor %}
      `,
      alreadyExist: /{% for p in line\.properties %}/gim,
    },
    // packing slip
    packingSlip: {
      value: ``,
      search: ``,
      replace: ``,
    },
  };

  const injectCode = () => {
    if (code.value !== "") {
      state.userInput = code.value.toString();
      let replaced = state.userInput.replace(
        state.orderConfirmationFinder,
        state.pplrOrderConfiramtion
      );
      code.value = replaced;
      console.log(replaced);
    } else {
      console.log("please paste your email template");
    }
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // check if the textarea value is empty
    if (textarea.value !== "") {
      // order confirmation
      if (select.value == "order-confirmation") {
        state.orderConfirmation.value = textarea.value.toString();
        let value = state.orderConfirmation.value;
        let regex = state.orderConfirmation.search;
        let replace = state.orderConfirmation.replace;
        let exist = state.orderConfirmation.alreadyExist;

        // check if its a order template
        if (value.match(regex) != null) {
          let replaced = value.replace(regex, replace);
          textarea.value = replaced;
          showFeedback(
            "alert-success",
            "😀 Sucessfull added product personalizer code"
          );
        } else {
          showFeedback("alert-danger", "😞 Not a Order Confirmation template");
        }
      }
      // packing slip
      if (select.value == "packing-slip") {
        console.log("You have selected order packing-slip template");
      }
      // shipping confirmation
      if (select.value == "shipping-confirmation") {
        console.log("You have selected order shipping-confirmation template");
      }
    } else {
      showFeedback("alert-danger", "Please paste your template.");
    }
  });
});

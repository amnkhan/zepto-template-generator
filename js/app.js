document.addEventListener("DOMContentLoaded", () => {
  // global variables
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

  // generator function
  function generator(object, text) {
    object.value = textarea.value.toString();
    let value = object.value;
    let regex = object.search;
    let replace = object.replace;

    // check if its a order template
    if (value.match(regex) != null) {
      let replaced = value.replace(regex, replace);
      textarea.value = replaced;
      showFeedback(
        "alert-success",
        "😀 Sucessfull added Product Personalizer code"
      );
    } else {
      showFeedback("alert-danger", `😞 Not a ${text} template`);
    }
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
      {% endunless %}
      {% endfor %}
      `,
    },
    // packing slip
    packingSlip: {
      value: ``,
      search:
        /{% if line_item\.sku != blank %}\s*<span class="line-item-description-line">\s*{{ line_item\.sku }}\s*<\/span>\s*{% endif %}/gim,
      replace: `
        {% if line_item.sku != blank %}
        <span class="line-item-description-line">
          {{ line_item.sku }}
        </span>
        {% endif %}
        
        {% for p in line_item.properties %}
        {% assign hidden_property = p.first | first | replace: '_', true %}
        {% unless p.last == blank %}
        {% if hidden_property == 'true' %}
        {% else %}
        {{ p.first }}:
        {% if p.last contains '/uploads/' or p.last contains '/assets/' or p.last contains '/products/' %}
        <img style="width:50px;height:auto" src="{{ p.last }}"/>{% else %}{{ p.last | newline_to_br }}
        {% endif %}  
        <br> 
        {% endif %}
        {% endunless %}
        {% endfor %}
      `,
    },
    // fulfilment template
    fulfilment: {
      value: ``,
      search: /<p>\s*Variant Title:\s*{{ line\.line_item\.title }}\s*<\/p>/gim,
      replace: `
      <p>Variant Title: {{ line.line_item.title }}</p>
      {% for p in line.line_item.properties %}   
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
      {% endunless %}
      {% endfor %}
      `,
    },
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // check if the textarea value is empty
    if (textarea.value !== "") {
      // order confirmation
      if (select.value == "order-confirmation") {
        generator(state.orderConfirmation, "order confirmation");
      }
      // packing slip
      if (select.value == "packing-slip") {
        generator(state.packingSlip, "packing slip");
      }
      // fulfillment confirmation
      if (select.value == "fulfillment-confirmation") {
        generator(state.fulfilment, "fulfilment template");
      }
    } else {
      showFeedback("alert-danger", "Please paste your template.");
    }
  });
});

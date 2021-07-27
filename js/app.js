document.addEventListener("DOMContentLoaded", () => {
  const code = document.querySelector("#editor");
  const trigger = document.querySelector(".trigger-btn");
  code.value = "";

  // Data store
  let state = {
    // find
    pplrOrderConfiramtion: `{% if line.variant.title != 'Default Title' %}
        <span class="order-list__item-variant">{{ line.variant.title }}</span><br/>
      {% endif %}
      {% for p in line.properties %}   
      {% assign hidden_property = p.first | first | replace: '_', true %}
      {% unless p.last == blank %} 
      {% if p.first contains 'pdf' %}
      
      {% assign hidden_property = false%}
      {% assign p.first = p.first | replace: '_' %}
      
      {% endif %} 
      
      
      {% if hidden_property == 'true' %} 
       <span style="display:none;" class="product-personalizer-line-item-prop" data-prop-name="{{ p.first }}">{{ p.first }}: {{ p.last }}</span> 
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
      <a target="_blank"  href="{{ p.last }}?format={{ format }}" src="{{ p.last }}?format={{ format }}" class="jslghtbx-thmb" data-jslghtbx download>Download {{ format }} file</a> 
      {% else %} 
      {{ p.last | newline_to_br }} 
      {% endif %} 
      <br> 
      {% endif %} 
      {% endunless %}{% endfor %}`,
    // replace with
    orderConfirmationFinder:
      /{% if line\.variant\.title != 'Default Title' %}\s*<span class="order-list__item-variant">{{ line\.variant\.title }}<\/span><br\/>\s*{% endif %}/gim,
    // user pasted code
    userInput: ``,
  };
  // https://jsfiddle.net/x7f6bgda/5/
  //   // Inject the code
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

  // Check if the button is clicked
  trigger.addEventListener("click", injectCode);
  console.log(typeof state.pplrOrderConfiramtion);
});

// let string = "ABC";
// let newString = string.repeat(A , D);
// DBC

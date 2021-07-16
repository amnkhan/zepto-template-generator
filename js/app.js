document.addEventListener('DOMContentLoaded', () => {
    const code = document.querySelector("#editor");
    const trigger = document.querySelector(".trigger-btn");
    code.value = '';
    let store = {
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
        orderConfirmationFinder: `{% if line.variant.title != 'Default Title' %}
        <span class="order-list__item-variant">{{ line.variant.title }}</span><br/>
      {% endif %}`,
        userInput: ``,
    }


    // Inject the code
    const injectCode = () => {
      if(code.value !== '') {
        store.userInput = code.value;
        // console.log(store.userInput);
        // store.userInput.replace(store.orderConfirmationFinder , store.pplrOrderConfiramtion);
        let result = store.userInput.search(store.orderConfirmationFinder);
        console.log(store.userInput);
      } else {
        console.log("please paste your shopify email template")
      }
    }

    // Check if the button is clicked
    trigger.addEventListener('click' , injectCode);
});
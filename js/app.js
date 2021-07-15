document.addEventListener('DOMContentLoaded', () => {
    const code = document.querySelector("#editor");
    const trigger = document.querySelector(".trigger-btn");
    let store = {
        injectCode: `{% for p in line.properties %} {% assign hidden_property = p.first | first | replace: '_', true %} {% unless p.last == blank %}{% if p.first contains 'pdf' %} {% assign hidden_property = false%} {% assign p.first = p.first | replace: '_' %} {% endif %} {% if hidden_property == 'true' %} <span style="display:none;" class="product-personalizer-line-item-prop" data-prop-name="{{ p.first }}">{{ p.first }}: {{ p.last }}</span> {% else %} {{ p.first | replace: '_'}}: {% if p.last contains '/uploads/' or p.last contains '/assets/' or p.last contains '/products/' %} {% assign format = 'jpg' %} {% if p.last contains 'png' %} {% assign format = 'png' %} {% endif %} {% if p.last contains 'pdf' %} {% assign format = 'pdf' %} {% endif %} <a target="_blank" href="{{ p.last }}?format={{ format }}" src="{{ p.last }}?format={{ format }}" class="jslghtbx-thmb" data-jslghtbx download>Download {{ format }} file</a> {% else %} {{ p.last | newline_to_br }} {% endif %} <br> {% endif %} {% endunless %} {% endfor %} {% if line.selling_plan_allocation %} <span class="order-list__item-variant">{{ line.selling_plan_allocation.selling_plan.name }}</span><br/> {% endif %} {% if line.refunded_quantity > 0 %} <span class="order-list__item-refunded">Refunded</span> {% endif %} {% if line.discount_allocations %} {% for discount_allocation in line.discount_allocations %} {% if discount_allocation.discount_application.target_selection != 'all' %} <span class="order-list__item-discount-allocation"> <img src="{{ 'notifications/discounttag.png' | shopify_asset_url }}" width="18" height="18" class="discount-tag-icon" /> <span> {{ discount_allocation.discount_application.title | upcase }} (-{{ discount_allocation.amount | money }}) </span> </span> {% endif %} {% endfor %} {% endif %}</td><td class="order-list__price-cell"> {% if line.original_line_price != line.final_line_price %} <del class="order-list__item-original-price">{{ line.original_line_price | money }}</del> {% endif %}<p class="order-list__item-price"> {% if line.final_line_price > 0 %} {{ line.final_line_price | money }} {% else %} Free {% endif %}</p></td></table></td></tr>{% endfor %}</table><table class="row subtotal-lines"><tr><td class="subtotal-spacer"></td><td><table class="row subtotal-table"> {% for discount_application in discount_applications %} {% if discount_application.target_selection == 'all' %} {% capture discount_title %} {% if discount_application.title %} {{ discount_application.title | upcase }} {% else %} Discount {% endif %} {% endcapture %}<tr class="subtotal-line"><td class="subtotal-line__title"><p> <span>Discount</span> <span class="subtotal-line__discount"> <img src="{{ 'notifications/discounttag.png' | shopify_asset_url }}" width="18" height="18" class="discount-tag-icon" /> <span class="subtotal-line__discount-title">{{ discount_title }}</span> </span></p></td><td class="subtotal-line__value"> <strong>-{{ discount_application.total_allocated_amount | money }}</strong></td></tr> {% endif %} {% endfor %}`,
        userInput: ``,
    }


    // Inject the code
    const injectCode = () => {
      if(code.value !== '') {
        store.userInput = code.value.split(" ").join("");
        console.log(store.userInput);
      } else {
        console.log("please paste your shopify email template")
      }
    }

    // Check if the button is clicked
    trigger.addEventListener('click' , injectCode);
});
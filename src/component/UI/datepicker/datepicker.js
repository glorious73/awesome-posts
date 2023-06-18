import styles from './datepicker.css?raw';

import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
import date from 'air-datepicker/air-datepicker.css?raw';

function renderTemplate() {
  const template = document.createElement("template");

  template.innerHTML = /*html*/ `
    <div class="input-date-range">
        <input type="text" id="dateBegin" class="input-date" placeholder="> Date">
        <input type="text" id="dateEnd" class="input-date" placeholder="< Date">
    </div>
  `;
  return template;
}

export class DatePicker extends HTMLElement {
  constructor() {
      super();

      const shadow = this.attachShadow({ mode: "open" });
      const template = renderTemplate();
      shadow.appendChild(template.content.cloneNode(true));

      const stylesheet = new CSSStyleSheet();
      const datesheet  = new CSSStyleSheet();
      stylesheet.replace(styles);
      datesheet.replace(date);
      shadow.adoptedStyleSheets = [stylesheet, datesheet];
  }

  static get observedAttributes() {
    return ["data-begin-id", "data-end-id", "data-begin-value", "data-end-value"];
  }

  connectedCallback() {
    const sroot    = this.shadowRoot;
    this.dateBegin = sroot.querySelector("#dateBegin");
    this.dateEnd   = sroot.querySelector("#dateEnd");
    // date picker
    const now = new Date();
    this.dateBegin.picker = this.attachDatePicker(this.dateBegin.id, new Date().setHours(now.getHours()-1));
    this.dateEnd.picker   = this.attachDatePicker(this.dateEnd.id, now);
    // search
    this.searchEvent = this.getAttribute("data-search-event") || "searchEvent";
  }

  disconnectedCallback() {
    this.dateBegin.picker.destroy();
    this.dateEnd.picker.destroy();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(name === "data-begin-id")
      this.updateDatePicker(this.dateBegin, newValue);
    if(name === "data-end-id")
      this.updateDatePicker(this.dateEnd, newValue);
    if(name === "data-begin-value")
      this.dateBegin.picker.selectDate(new Date(newValue));
    if(name === "data-end-value")
      this.dateEnd.picker.selectDate(new Date(newValue));
  }

  attachDatePicker(id, date) {
    const datePicker = new AirDatepicker(this.shadowRoot.querySelector(`#${id}`), { 
        container: this.shadowRoot.getRootNode(),
        locale: localeEn,
        dateFormat: 'yyyy-MM-dd',
        timeFormat: 'HH:mm',
        timepicker: true,
        autoClose: true,
        onHide: (isFinished) => this.filter(isFinished, id)
    });
    if(date)
      datePicker.selectDate(date);
    return datePicker;
  }

  updateDatePicker(element, id) {
    element.id     = id;
    element.picker = this.attachDatePicker(id);
  }

  filter(isFinished, id) {
    if(isFinished) {
        const element = this.shadowRoot.querySelector(`#${id}`);
        if(element) {
          if(element.value != element.lastValue)
            document.dispatchEvent(
                new CustomEvent(this.searchEvent, {
                    detail: {  id: id, value: element.value }
                })
            );
          element.lastValue = element.value;
        }
    }
  }
}
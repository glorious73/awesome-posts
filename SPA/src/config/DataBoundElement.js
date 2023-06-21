export class DataBoundElement {
  constructor(element, data, content) {
    this.data = data;
    this.element = element;
    this.content = content;
    element[this.content] = data;
    element.addEventListener("change", this, false);
  }

  change(value) {
    this.data = value;
    this.element[this.content] = value;
  }

  handleEvent(event) {
    switch (event.type) {
      case "change":
        this.change(this.element[this.content]);
    }
  }
}
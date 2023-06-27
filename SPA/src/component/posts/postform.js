import styles from './posts.css?raw';
import input from '../../css/input.css?raw';
import form from '../../css/form.css?raw';

import crudService from '../../service/CRUDservice';
import uiService from '../../service/UIService';

function renderTemplate() {
    const template = document.createElement("template");

    template.innerHTML = /*html*/ `
        <div class="form-container fade-in">
            <div class="form-flex">
              <div class="form-title-wrapper">
                  <a class="form-title-back-btn" id="btnBack">
                    <svg class="icon-form-back" viewBox="-0.5 -0.5 16.9 16.9">
                        ${Globals.icons.querySelector(`#arrow-left-circle`).innerHTML}
                    </svg>
                  </a>
                  <h1 class="form-title" id="formTitle">ADD POST</h1>
              </div>
              <form action="" id="postForm"></form>
              <div class="mt-1">
                  <input type="hidden" id="userId" name="userId" form="postForm">
                  <h2 class="form-flex-row-title form-flex-row-title-first">
                  Information
                  </h2>
                  <div class="form-flex-row">
                      <label for="title">Title</label>
                      <input type="text" class="input-text-form-flex" id="Title" name="title" form="postForm" required>
                  </div>
                  <div class="form-flex-row">
                      <label for="description">Description</label>
                      <textarea rows="5" class="input-text-form-flex" id="description" name="description" form="postForm" required></textarea>
                  </div>
                  <div class="form-flex-row">
                      <label for="location">Location</label>
                      <input type="text" class="input-text-form-flex" id="location" name="location" form="postForm" required>
                  </div>
                  <div class="form-flex-row">
                      <label></label>
                      <button type="submit" form="postForm" style="display:none;">submit</button>
                      <app-button data-classes="btn btn-secondary btn-form-flex" id="btnSubmit">
                        <span slot="text" id="txtSubmit">Add</span>
                      </app-button>
                  </div>
              </div>
            </div> 
        </div> 
    `;
    return template;
}

export class PostForm extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });
        const template = renderTemplate();
        shadow.appendChild(template.content.cloneNode(true));

        const stylesheet = new CSSStyleSheet();
        const inputsheet = new CSSStyleSheet();
        const formsheet = new CSSStyleSheet();
        stylesheet.replace(styles);
        inputsheet.replace(input);
        formsheet.replace(form);
        shadow.adoptedStyleSheets = [stylesheet, inputsheet, formsheet];
    }

    async connectedCallback() {
        const sroot = this.shadowRoot;
        // edit switch
        this.isEdit = false;
        const match = JSON.parse(this.getAttribute("data-match"));
        if(match)
            this.loadEditForm(match);
        sroot.querySelector("#btnBack").addEventListener("click", (e) => document.dispatchEvent(new CustomEvent("NavigateEvent", { detail: { type: "name", name: "posts" } })));
        sroot.querySelector("#userId").value = JSON.parse(localStorage.getItem("user")).id;
        const form = sroot.querySelector("#postForm");
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            await this.submitForm(e.target);
        });
        sroot.querySelector("#btnSubmit").addEventListener("click", async (e) => {
            if(form.reportValidity())
                await this.submitForm(form);
        });
    }

    disconnectedCallback() {

    }

    async loadEditForm(match) {
        // UI
        uiService.dataBindElements(this, "input&--&value,textarea&--&value");
        this.shadowRoot.querySelector("#formTitle").innerHTML = "EDIT POST";
        this.shadowRoot.querySelector("#txtSubmit").innerHTML = "Edit";
        // Post
        this.id = match.data.id;
        this.isEdit = true;
        const post = await this.loadPost();
    }

    async loadPost() {
        try {
            let post = JSON.parse(localStorage.getItem("post"));
            if(!post || (post.id != this.id))
                post = (await crudService.getItemById("/api/post",this.id)).post;
            post.Title = post.title; // "title" is an HTML attribute. Way around it.
            for (const [key, value] of Object.entries(post)) 
                if (this[key] && this[key].change) this[key].change(value);
            return post;
        } 
        catch (err) {
            uiService.showAlert("Error", err.message);
        }
      }

    async submitForm(form) {
        const btnSubmit = this.shadowRoot.querySelector("#btnSubmit");
        try {
            btnSubmit.setAttribute("data-is-loading", true);
            const { post } = (this.isEdit) 
                ? await crudService.editItem("/api/post", this.id, form) 
                : await crudService.addItem("/api/post", form);
            uiService.showAlert("Success", `${post.title} was ${(this.isEdit) ? 'edited' : 'created'} successfully.`);
            document.dispatchEvent(new CustomEvent("NavigateEvent", { detail: { type: "name", name: "posts" } }));
        }
        catch (err) {
            uiService.showAlert("Error", err.message);
        }
        finally {
            btnSubmit.setAttribute("data-is-loading", false);
        }
    }
}
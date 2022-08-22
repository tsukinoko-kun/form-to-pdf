# form-to-pdf

Build for [Pipedream](https://pipedream.com)

Send a POST request to this endpoint with the form data and a PDF will be generated.

```html
<form action="https://….m.pipedream.net" method="post">
  <input type="hidden" name="head" value="Foo Inc.\nBarstr. 42\n12345 Baz" />
  <input type="hidden" name="author" value="Foo Inc." />
  <input type="hidden" name="title" value="Order request form" />
  <label>
    E-Mail*
    <input
      type="email"
      name="email"
      autocomplete="email"
      required
      maxlength="320"
    />
  </label>
  <label>
    Order request*
    <input type="text" name="Order request" required maxlength="320"
  /></label>
  <button>Print</button>
</form>
```

{% if method %}
<div class="page-header">
<h1>.{{method.name}}() <a title="Suggest edits" target="_blank" class="edit-source" href="{{method.editLink}}">Suggest edits</a></h1>
{% if method.since %}<span class="since">Since: {{method.since}}</span>{% endif %}
</div>
<br>

  {% autoescape false %}{{method.descr}}{% endautoescape %}

{% if method.api == 'protocol.cdp' %}
{% autoescape false %}
<p class="alert alert-warning"><code>{{method.name}}()</code> is only available when using Chrome or Edge drivers.</p>
{% endautoescape %}{% endif %}

{% if method.api == 'protocol.elementinteraction' || method.api == 'protocol.elementstate' || method.api == 'protocol.elementlocation' %}
{% autoescape false %}
<p class="alert alert-info">The command <code>{{method.name}}()</code> will automatically wait for the element to be present (until the specified timeout). If the element is not found, an error is thrown which will cause the test to fail. You can suppress element not found errors by specifying the `selector` argument as an object and passing the `suppressNotFoundErrors = true` option.</p>

{% endautoescape %}{% endif %}

{% if method.api == 'protocol.elements' || method.api == 'protocol.elementstate' || method.api == 'protocol.elementinteraction' || method.api == 'protocol.waitforelements' %}
{% autoescape false %}
For more info on working with DOM elements in Nightwatch, refer to the <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Finding & interacting with DOM Elements</a> guide page.
{% endautoescape %}{% endif %}
  
    {% if method.internal %}
    {% autoescape false %}<p class="alert alert-warning">Please note that this command operates on a protocol level and accepts the <a href="https://www.w3.org/TR/webdriver1/#dfn-web-elements">Web Element ID</a> as the parameter.
    To retrieve it, use either the <code>.findElement()</code> or <code>.findElements()</code> command. Read more on <a href="https://nightwatchjs.org/guide/writing-tests/finding-interacting-with-dom-elements.html">Element retrieval</a>.</p>
    {% endautoescape %}{% endif %}
    {% if method.jsonwire %}
    {% autoescape false %}<p class="alert alert-warning">This command has been deprecated and is not available when using <a href="https://www.w3.org/TR/webdriver1/">W3C Webdriver</a> clients (such as GeckoDriver).
      It's only available when using the Selenium <a href="https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol" target="_blank">JSONWire Protocol</a>.
    </p>
{% endautoescape %}{% endif %}

{% if method.syntax %}
<h3>Usage</h3>

{% for syntax in method.syntax %}{% autoescape false %}
<div class="sample-test">
<pre class="language-javascript" style="padding-top: 10px; margin-bottom: 10px"><code class="language-javascript">{{syntax.replace(', callback', ', [callback]')}}</code></pre>
</div>
{% endautoescape %}{% endfor %}

{% endif %}


<h3>Parameters</h3>
<div class="table-responsive">
  <table class="table table-bordered table-striped">
    <thead>
     <tr>
       <th style="width: 100px;">Name</th>
       <th style="width: 100px;">Type</th>
       <th>description</th>
     </tr>
    </thead>
    <tbody>
     {% for param in method.params %}
     <tr>
       <td><code>{{param.name}}</code>{% if param.optional %}<br><span class="optional">Optional</span>{% endif %}</td>
       <td>{{param.types}}</td>
       <td>{% autoescape false %}{{param.descr}}{% endautoescape %}</td>
     </tr>
     {% endfor %}
    </tbody>
  </table>
</div>

{% if method.returns %}

<h3>Returns</h3>
  <div class="table-responsive">
    <table class="table table-bordered table-striped">
      <thead>
       <tr>
         <th style="width: 200px;">Type</th>
         <th>description</th>
       </tr>
      </thead>
      <tbody>
       <tr>
         <td>{{method.returns.type}}</td>
         <td>{{method.returns.descr}}</td>
       </tr>
      </tbody>
    </table>
</div>
{% endif %}

{% if !method.exampleLink %}
{% if method.example %}
<h3>Example</h3>
<div class="sample-test">
{% autoescape false %}<pre class="line-numbers language-javascript"><code class="language-javascript">{{method.example}}</code></pre>{% endautoescape %}
</div>
{% endif %}
{% endif %}

{% if method.exampleLink %}
<h3>Example</h3>
<div class="sample-test">
<iframe width="100%" height="500" src="/__examples/{{method.name}}.html"></iframe>
</div>


Or run locally with:

<div class="sample-test">
{% autoescape false %}<pre class="hide-indicator language-bash"><code class="language-bash">git clone https://github.com/nightwatchjs/nightwatch-examples.git
cd nightwatch-examples
npm install
npx nightwatch tests{{method.exampleLink}} --env chrome
</code></pre>{% endautoescape %}
</div>
<a target="_blank" href="https://github.com/nightwatchjs/nightwatch-examples"><button>View on Github</button></a>
{% endif %}

{% if method.more %}
{% autoescape false %}{{method.more}}{% endautoescape %}
{% endif %}

{% if method.see.length > 0 %}
<h3>See also</h3>
<ul class="api-related-links">
{% for link in method.see %}
<li><a href="/api/{{link}}.html">{{link}}</a></li>
{% endfor %}
</ul>
{% endif %}


{% if method.moreInfoLink %}
<h3>Recommended content</h3>
<ul>
  <li><code><a href="https://{{method.moreInfoLink}}" target="_blank">{{method.moreInfoLink}}</a></code></li>
</ul>
{% endif %}

{% if method.link %}
<h3>W3C WebDriver spec</h3> 
<ul>
  <li><code><a href="{{method.link}}" target="_blank">{{method.link}}</a></code></li>
</ul>
{% endif %}

<div class="docs-section" data-page-uri="/api/$method">
<div class="page-header">
<h2>.clearValue() <a title="Suggest edits" target="_blank" class="edit-source" href="https://github.com/nightwatchjs/nightwatch/edit/main/lib/api/element-commands/clearValue.js?message=api-docs%3A%20update%20clearValue#">Suggest edits</a></h2>
</div>
<br>

  <p>Clear a textarea or a text input element's value. Starting with v1.1 <code>clearValue()</code> will wait for the element to be present (until the specified timeout).</p>
<p>If the element is not found, an error is thrown which will cause the test to fail. Starting with <code>v1.2</code> you can suppress element not found errors by specifying the <code>suppressNotFoundErrors</code> flag.</p>
  
  
      <p class="alert alert-info"><code>clearValue()</code> will automatically wait for the element to be present (until the specified timeout). If the element is not found, an error is thrown which will cause the test to fail. Starting with <code>v1.2</code> you can suppress element not found errors by specifying the <code>suppressNotFoundErrors</code> option.</p>
  
    
    


<h3>Syntax</h3>
<div class="sample-test">
<pre data-language="javascript" style="padding-top: 10px" class="default-theme language-javascript"><code class="default-theme language-javascript">.clearValue(selector, [callback])
.clearValue(using, selector, [callback])</code></pre>
</div>
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
         
         <tr>
           <td><code>using</code><br><span class="optional">Optional</span></td>
           <td>string</td>
           <td><p>The locator strategy to use. See <a href="https://www.w3.org/TR/webdriver/#locator-strategies">W3C Webdriver - locator strategies</a></p></td>
         </tr>
         
         <tr>
           <td><code>selector</code></td>
           <td>string|object</td>
           <td><p>The selector (CSS/Xpath) used to locate the element. Can either be a string or an object which specifies <a href="https://nightwatchjs.org/guide#element-properties">element properties</a>.</p></td>
         </tr>
         
         <tr>
           <td><code>callback</code><br><span class="optional">Optional</span></td>
           <td>function</td>
           <td><p>Optional callback function to be called when the command finishes.</p></td>
         </tr>
         
        </tbody>
      </table>
    </div>

    

    
    <h3>Usage</h3>
<div class="sample-test">
<pre class="line-numbers" data-language="javascript" class=" language-javascript"><code class=" language-javascript">module.exports = {
  demoTest(browser) {
    browser.clearValue(&#39;#login input[type=text]&#39;);

    browser.clearValue(&#39;#login input[type=text]&#39;, function(result) {
      console.log(&#39;clearValue result&#39;, result);
    });

    // with explicit locate strategy
    browser.clearValue(&#39;css selector&#39;, &#39;#login input[type=text]&#39;);

    // with selector object - see https://nightwatchjs.org/guide#element-properties
    browser.clearValue({
      selector: &#39;#login input[type=text]&#39;,
      index: 1,
      suppressNotFoundErrors: true
    });

    browser.clearValue({
      selector: &#39;#login input[type=text]&#39;,
      timeout: 2000 // overwrite the default timeout (in ms) to check if the element is present
    });
  }
}</code></pre>
</div>



<h3 id="examples">Examples</h3>
<p>The example below navigates to google.com, searches for the term &quot;nightwatch.js&quot;, then clears the input using <em>clearValue</em> command and finally verifies if the results container is empty:</p>
<div class="sample-test">
<pre data-language="javascript" class=" language-javascript"><code class=" language-javascript">
module.exports = {
  before : function(browser) {
    // see <a href="https://github.com/nightwatchjs/nightwatch/blob/main/examples/globalsModule.js#L12">https://github.com/nightwatchjs/nightwatch/blob/main/examples/globalsModule.js#L12</a>
    browser.globals.waitForConditionTimeout = 5000;
  },

  &#39;clearValue example test&#39; : function (browser) {

    browser
      .url(&#39;<a href="https://google.com">https://google.com</a>&#39;)
      .waitForElementVisible(&#39;input[type=text]&#39;)
      .setValue(&#39;input[type=text]&#39;, &#39;nightwatch.js&#39;)
      .click(&#39;button[type=submit]&#39;)
      .expect.element(&#39;#rcnt&#39;).text.to.contain(&#39;nightwatchjs.org/&#39;);

    browser
      .clearValue(&#39;input[type=text]&#39;)
      .expect.element(&#39;#rcnt&#39;).text.to.equal(&#39;&#39;);
  },

  after : function(browser) {
    browser.end();
  }
};
</code></pre>
</div>

<h3 id="output">Output</h3>
<div class="sample-test">
<pre data-language="javascript">
[Clear Value] Test Suite
============================

Running:  clearValue example test
 ✔ Element <input[type=text]> was visible after 68 milliseconds.
 ✔ Expected element &lt;#rcnt&gt; text to contain: &quot;nightwatchjs.org/&quot; - condition was met in 763ms
 ✔ Expected element &lt;#rcnt&gt; text to equal: &quot;&quot; - condition was met in 36ms

OK. 3 assertions passed. (7.593s)
</pre>
</div>

<h3 id="possible-errors">Possible Errors</h3>
<p>Here are the type of errors that you might get when using <code>clearValue</code>. Full error details are available when running nightwatch with <code>--verbose</code> flag.</p>
<ul>
<li><code>invalid element state</code> - if the referenced element is disabled or is not displayed.</li>
<li><code>element not visible</code> - if the referenced element is not visible on the page (either is hidden by CSS, has 0-width, or has 0-height)</li>
</ul>





<h3>More info</h3> <code><a href="https://www.w3.org/TR/webdriver#dfn-element-clear" target="_blank">w3.org/TR/webdriver#dfn-element-clear</a></code>

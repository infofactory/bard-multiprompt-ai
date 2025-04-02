# Bard Multiprompt AI

> Bard Multiprompt AI is a Statamic addon that adds AI functionalities to the Bard editor.

## Features

This addon lets you:

- Create custom prompts tailored to your needs
- Choose different models for each prompt
- Adjust and tweak settings to get the best result
- Replace or append the generated text directly in the editor

## How to Install

You can search for this addon in the `Tools > Addons` section of the Statamic control panel and click **install**, or run the following command from your project root:

``` bash
composer require infofactory/bard-multiprompt-ai
```

## How to Use

This addon under the hood uses [PrismPHP](https://github.com/prism-php/prism).

Providers are configured following Laravel's environment configuration best practices:

1. Each provider's configuration pulls values from environment variables
2. Default values are provided as fallbacks
3. Environment variables follow a predictable naming pattern: 
  - API keys: `PROVIDER_API_KEY`
  - URLs: `PROVIDER_URL`
  - Other settings: `PROVIDER_SETTING_NAME`

You can check which providers are supported and how to configure them following [Prism's documentation](https://prismphp.com/getting-started/configuration.html).

If a Provider you're looking for is not yet supported you can always [extend Prism with a Custom Provider](https://prismphp.com/advanced/custom-providers.html).

## Author

This addon has been developed by developers at [infoFactory](https://infofactory.it).

## License

"Bard Multiprompt AI" is paid software with a source-available codebase. If you want to use it, you’ll need to buy a license from the Statamic Marketplace. The license is valid for only one project.
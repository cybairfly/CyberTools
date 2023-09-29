# Cyber/Human

> Humanized toolset for automated simulation of human behavior in browsers as a means of avoiding bot detection.

Member of: [**CyberTools**](https://www.npmjs.com/package/cyber-tools)

## Features

- fully automated mode with spontaneous human behavior simulation
- public methods for manual operation and more granular control
- automated logging with potentially sensitive details redacted
- optional visual pointer tracker for observing cursor motion
- automatic prevention of interference between spontaneous movements and intentional actions (clicks etc.)

## Deployment

- `npm i apify-human`
- follow inline docs

Usage (Apify Robot):
Enable option on input and use human in the scope after extracting it from context
```js
[task] = ({page, human}) => ({
    await human.press('Enter');
})
```

Usage (standalone):
```js
const human = new Human(page, [options]);
await human.type('#username', 'username');
await human.type('#password', 'password');
await human.press('Enter').catch(() => human.click('#submit'));
```

## Dependency

* [Apify](https://sdk.apify.com) - a lower level web automation framework

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://gitlab.com/cybaerfly/apify-human/-/tags). 

## Authors

- Vasek Codey Vlcek - maintainer
- Milán Vasárhelyi - documentation

List of [contributors](https://gitlab.com/cybaerfly/apify-human/-/graphs/master) participating in this project.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE.md](LICENSE.md) file for details
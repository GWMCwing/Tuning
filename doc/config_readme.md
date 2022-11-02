# Config Setting

This is a description of the [config.json](../config.json) file, and possible values.

Keys in block letters are constant values and cannot be changed via the command line after the program has started. Otherwise, the value can be changed via the command line.

Each key value pairs are described in the following format:

```md
Key
: Description of the key
: Possible values
: Default value
```

Most of the default values when the key values are not parsable are saved in the [defaultValue.ts](../src/util/defaultValue.ts) file.

Template for config.json is saved in [config_template.json](./config_template.json).

---

## _Console Related_

### LogLevel

- Description: This is the default log level for the console
- Possible Values: `DEBUG`, `INFO`, `LOG`, `WARN`, `ERROR`
- Default: `INFO`

---

## _Discord Related_

### TOKEN

- Description: This is the token for the discord bot
- Possible Values: `string`
- Default: `No Default Value`

### PREFIX

- Description: This is the default prefix for the discord bot, however, this can be changed via bot commands for each server, but not user
- Possible Values: `string`
- Default: `$`

### DefaultTimeout

- Description: This is the default timeout for the discord bot voice connections
- Possible Values: `int` (in milliseconds)
- Default: `30000`

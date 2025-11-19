import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";

const reactConfig = fixupConfigRules(pluginReactConfig);

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...reactConfig,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];

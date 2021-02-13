import React from "react";

import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { withKnobs, text, number, array } from "@storybook/addon-knobs";

import BarGraph from "./barGraph";

const description = "## React Chart.js Bar Chart\n" +
  "AWS status Bar Graph"

const components = storiesOf('Components', module);
components
  // @ts-ignore
  .addDecorator(withInfo({ inline: true, header: true, text: description }))
  .addDecorator(withKnobs)
  .add('BarGraph', () => (
    <BarGraph labels={array('labels', ["test", "test2", "test3", "test4", "test5"])} data={[number('data1', 12), 14, 15, 16, 17]} title={text("title", "test")}
    />
  ));

const { parse } = require("himalaya");
const _ = require("lodash");

function tag(tag) {
  return { tagName: tag }
}

function getHeadTag(parsed) {
  const [{ children: html }] = _.filter(parsed,tag("html"));
  const [{ children: head }] = _.filter(html,tag("head"));
  return head;
}

function getTitleTag(head) {
  const [{ children: [{ content: title }]}] = _.filter(head,tag("title"));
  return title;
}

function getOpenGraphTags(head) {
  return _.chain(head)
    .filter(tag("meta"))
    .map("attributes")
    .map((att) => _.map(att,({ key, value }) => ({ [key]: value })))
    .map((att) => _.assign(...att))
    .flatten()
    .filter("property")
    .value();
}

function metadata(h) {
  const parsed = parse(h);
  const head = getHeadTag(parsed);
  const title = getTitleTag(head);
  const openGraphTags = getOpenGraphTags(head);

  return {
    title,
    open_graph_tags: openGraphTags
  }
}

const functions = require("firebase-functions");
const axios = require("axios");

module.exports.api = functions.https.onRequest(async (req,res) => {
  const { query: { url } } = req;

  const { data } = await axios.get(url);

  const meta = metadata(data);

  res.json(meta);

  return meta;

})
figma.showUI(__html__, { width: 500, height: 500 });


figma.ui.onmessage = async (pluginMessage) => {
  await figma.loadFontAsync({ family: "Rubik", style: "Regular" });
  const nodes: SceneNode[] = [];

  if (pluginMessage.type == "create-card") {
    const postComponentSet = figma.root.findOne((node) => node.type === "COMPONENT_SET" && node.name === "post") as ComponentSetNode;
    let selectedVariant = postComponentSet.defaultVariant as ComponentNode;
    if (pluginMessage.darkModeState === true) {
      switch (pluginMessage.imageVariant) {
        case "1":
          selectedVariant = postComponentSet.findOne((node) => node.type == "COMPONENT" && node.name == "Image=single, Dark mode=true") as ComponentNode;
          break;
        case "2":
          selectedVariant = postComponentSet.findOne((node) => node.type == "COMPONENT" && node.name == "Image=carousel, Dark mode=true") as ComponentNode;
          break;
        default:
          selectedVariant = postComponentSet.findOne((node) => node.type == "COMPONENT" && node.name == "Image=none, Dark mode=true") as ComponentNode;
          break;
      }
    } else {
      switch (pluginMessage.imageVariant) {
        case "1":
          selectedVariant = postComponentSet.findOne((node) => node.type == "COMPONENT" && node.name == "Image=single, Dark mode=false") as ComponentNode;
          break;
        case "2":
          selectedVariant = postComponentSet.findOne((node) => node.type == "COMPONENT" && node.name == "Image=carousel, Dark mode=false") as ComponentNode;
          break;
        default:
          selectedVariant = postComponentSet.defaultVariant;
          break;
      }
    }

    let createdPost = selectedVariant.createInstance();

    const templateName = createdPost.findOne((node) => node.type == "TEXT" && node.name == "displayName") as TextNode;
    const templateUsername = createdPost.findOne((node) => node.type == "TEXT" && node.name == "@username") as TextNode;
    const templateDescription = createdPost.findOne((node) => node.type == "TEXT" && node.name == "description") as TextNode;

    const templateLikesLabel = createdPost.findOne((node) => node.type == "TEXT" && node.name == "likesLabel") as TextNode;
    const templateCommentsLabel = createdPost.findOne((node) => node.type == "TEXT" && node.name == "commentsLabel") as TextNode;

    templateName.characters = pluginMessage.name;
    templateUsername.characters = pluginMessage.username;

    templateDescription.characters = pluginMessage.description;

    templateLikesLabel.characters = Math.floor(Math.random() * 1000).toString();
    templateCommentsLabel.characters = Math.floor(Math.random() * 100).toString();

    nodes.push(createdPost);

    figma.viewport.scrollAndZoomIntoView(nodes);

  }
  figma.closePlugin();
};
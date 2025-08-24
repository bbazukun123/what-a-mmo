import { LayoutContainer } from "@pixi/layout/components";
import { TextInput } from "./TextInput";
import { FancyButton } from "@pixi/ui";
import { app } from "../utils/app";
import { Sprite, Text, Texture } from "pixi.js";

export class ChatBar extends LayoutContainer {
  private panel: Sprite;
  private placeholder: Text;
  private textInput: TextInput;
  private sendButton: FancyButton;

  constructor() {
    super({
      layout: {
        position: "absolute",
        bottom: 50,
        width: "90%",
        height: 100,
      },
    });

    this.panel = new Sprite({
      parent: this,
      texture: Texture.WHITE,
      tint: 0xdddddd,
      layout: {
        flexGrow: 1,
        height: "100%",
        marginRight: 25,
      },
    });

    this.placeholder = this.addChild(
      new Text({
        text: "Type your message here...",
        style: {
          align: "center",
          fontSize: 35,
          fill: 0xaaaaaa,
        },
      }),
    );
    this.placeholder.layout = {
      position: "absolute",
      marginLeft: 25,
      height: "100%",
    };

    this.textInput = new TextInput({
      target: this.panel,
      limit: 100,
      size: 35,
      padding: 10,
      onUpdate: (text) => {
        this.sendButton.enabled = text.length > 0;
      },
      onFocusChange: (focus) => {
        this.placeholder.visible = !focus && !this.textInput.value;
      },
      onSubmit: this.onSend.bind(this),
    });

    this.sendButton = this.addChild(
      new FancyButton({
        defaultView: new Sprite({
          texture: Texture.WHITE,
          tint: 0x00ff00,
          width: 200,
          height: 100,
        }),
        text: new Text({
          text: "Send",
          style: {
            fontSize: 35,
            fontWeight: "bold",
          },
        }),
      }),
    );
    this.sendButton.layout = {
      width: 200,
      height: 100,
    };
    this.sendButton.onPress.connect(this.onSend.bind(this));
  }

  private onSend() {
    const text = this.textInput.value;

    // Skip empty message
    if (text.trim() === "") return;

    // Handle sending the message
    app().playerController.sendMessage(text);
    this.textInput.value = "";
  }

  public start() {
    this.textInput.start();
  }

  public stop() {
    this.textInput.stop();
  }
}

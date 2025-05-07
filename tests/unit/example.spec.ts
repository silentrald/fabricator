import HomePage from "@/views/HomePage.vue";
import { mount } from "@vue/test-utils";

describe("HomePage.vue", () => {
  it("renders home view", () => {
    const wrapper = mount(HomePage);
    expect(wrapper.text()).toMatch("Inbox");
  });
});

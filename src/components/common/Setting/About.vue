<!--
 * @Author: cloudyi.li
 * @Date: 2023-03-23 13:51:37
 * @LastEditTime: 2023-05-26 11:27:20
 * @LastEditors: cloudyi.li
 * @FilePath: /chatserver-web/src/components/common/Setting/About.vue
-->
<script setup lang='ts'>
import { NScrollbar } from 'naive-ui'
</script>

<template>
  <div class="p-4 space-y-4">
    <h2 class="text-xl font-bold">
      关于项目
    </h2>
    <div class="p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700">
      <p>
        此项目已开源于 Github
        <a
          class="text-blue-600 dark:text-blue-500"
          href="https://github.com/wooveep/chatserver-web"
          target="_blank"
        >
          https://github.com/wooveep/chatserver-web
        </a>
      </p>
      <p>
        如果你觉得此项目对你有帮助，请在 Github 帮我点个 Star 或者给予一点赞助，谢谢！
      </p>
    </div>
    <h2 class="text-xl font-bold">
      免责协议
    </h2>
    <NScrollbar x-scrollable style="max-height: 80px" trigger="none">
      <div style="white-space: nowrap; padding: 12px">
        欢迎使用我们的人工智能问答网站。在使用本网站之前，请您仔细阅读以下。如果您不同意本协议的任何条款，请勿使用本网站。<br>
        1.本网站提供的所有信息仅供参考，不构成任何建议或建议的依据。我们不保证本网站提供的信息的准确性、完整性、及时性、可靠性、适用性、连续性或其他方面的任何保证。您应该自行承担使用本网站信息的风险。<br>
        2.本网站提供的信息可能会随时更改，我们不保证本网站提供的信息的及时更新。我们不承担因使用本网站信息而导致的任何损失或损害的责任。<br>
        3.本网站提供的信息可能包含第三方提供的信息或链接，这些信息或链接不受我们的控制。我们不对这些信息或链接的准确性、完整性、及时性、可靠性、适用性、连续性或其他方面做出任何保证。我们不对因使用这些信息或链接而导致的任何损失或损害承担责任。<br>
        4.本网站提供的信息可能涉及到法律、医疗、财务或其他专业领域的问题。我们不是法律、医疗、财务或其他专业领域的专家，我们不提供任何法律、医疗、财务或其他专业领域的建议。您应该咨询相关专业人士以获取适当的建议。<br>
        5.本网站提供的信息可能会受到黑客攻击、病毒、间谍软件或其他恶意软件的影响。我们不保证本网站是免疫这些问题的。您应该采取适当的安全措施来保护您的计算机和信息。<br>
        6.本网站可能会收集您的个人信息，例如您的IP地址、浏览器类型、操作系统等信息。我们将严格保护您的个人信息，并遵守适用的隐私法律法规。我们不会将您的个人信息出售或出租给第三方。但是，我们可能会将您的个人信息与我们的合作伙伴共享，以便为您提供更好的服务。我们将采取适当的措施来保护您的个人信息的安全。<br>
        7.本网站可能会包含广告或推广内容。这些广告或推广内容不代表我们的观点或建议。我们不对这些广告或推广内容的准确性、完整性、及时性、可靠性、适用性、连续性或其他方面做出任何保证。您应该自行承担使用这些广告或推广内容的风险。<br>
        8.我们保留随时更改本免责协议的权利。如果我们更改了本免责协议，我们将在本网站上发布更新的版本。您应该定期查看本免责协议以了解任何更改。如果您继续使用本网站，即表示您同意更新的免责协议。<br>
        如果您对本免责协议有任何疑问，请联系我们。<br>
      </div>
    </NScrollbar>
    <h2 class="text-xl font-bold">
      联系方式
    </h2>
    <p>邮箱： cloudyi@wooveep.net </p>
  </div>
</template>

/**
 *  Introduces component library styles on demand.
 * https://github.com/antfu/unplugin-auto-import
 */
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export function configAutoImportPlugin() {
  return AutoImport({
    include: [
      /\.[tj]sx?$/, // ts,tsx,js,jsx
      /\.vue$/,
      /\.vue\?vue/, // .vue
      /\.md$/, // .md
    ],
    imports: ["vue", "vue-router", "@vueuse/core"],
    // 指定auto-import生成文件位置，使用ts建议设置为src/auto-import.d.ts
    dts: "src/auto-import.d.ts",
    // ui库解析器
    resolvers: [
      ElementPlusResolver({
        // 关键：自动引入修改主题色添加这一行，使用预处理样式，不添加将会导致使用ElMessage，ElNotification等组件时默认的主题色会覆盖自定义的主题色
        importStyle: "sass",
      }),
    ],
  });
}

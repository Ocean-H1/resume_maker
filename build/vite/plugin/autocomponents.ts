/**
 *  Introduces component library styles on demand.
 * https://github.com/antfu/unplugin-vue-components
 */
import Components from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export function configAutoComponents() {
    return Components({
        // 指定组件位置,默认是 src/components
        // dirs: ['src/components'],
        // 配置生成文件位置
        dts: 'src/components.d.ts',
        // ui库解析器
        resolvers: [
            ElementPlusResolver({
                // 自动引入修改主题色，使用预处理器样式
                importStyle: 'sass'
            })
        ]
    })
}
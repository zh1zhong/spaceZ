export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
      },
    ],
  ],
  alias: {
    '@': require('path').resolve(__dirname, './src'),
    '@components': require('path').resolve(__dirname, './src/components'),
  },
};

import path from 'path-browserify'


export default function runshell(formState) {
    const cmdpath = path.resolve();
    const cmd = cmdpath + "\\ncnn\\waifu2x-ncnn-vulkan.exe " + "-i " + formState.inputFile + " -o " + formState.outputDir + "\\output.png" + " -n " + formState.denoise + " -s " + formState.upscale
    return cmd
}
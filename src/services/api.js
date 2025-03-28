import Anthropic from '@anthropic-ai/sdk';

const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

/**
 * Service for interacting with the Claude API
 */
export const remixService = {
  /**
   * Remix content using Claude API
   * @param {string} content - The content to remix
   * @param {Object} preset - Preset settings for remixing
   * @returns {Promise<string>} - The remixed content
   */
  remixContent: async (content, preset = {}) => {
    try {
      // Initialize the Anthropic client with dangerouslyAllowBrowser option
      const anthropic = new Anthropic({
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true
      });
      
      // Construct the prompt based on preset settings
      let prompt = `You are an expert LinkedIn post writer. Help me write a LinkedIn post`;
      
      // Add persona context
      if (preset.persona === 'Company') {
        prompt += ` for use on a company page`;
      } else if (preset.persona === 'Personal') {
        prompt += ` for use in my own name`;
      }
      
      // Add content type
      if (preset.contentType) {
        prompt += ` in a ${preset.contentType.toLowerCase()} style`;
      }
      
      // Add tone of voice example if provided
      if (preset.toneOfVoice) {
        prompt += `\n\nUse this style, tone of voice & language as your main reference: "${preset.toneOfVoice}"`;
      }
      
      // Add competitor points if provided
      if (preset.competitorPoints) {
        prompt += `\n\nExtra context / examples of other posts we like (if empty, ignore): ${JSON.stringify(preset.competitorPoints)}`;
      }
      
      // Add illustration request if enabled
      if (preset.includeIllustrations) {
        prompt += `\n\nObjective: Please also create actionable visual content specifications optimized for LinkedIn's B2B environment and adjusted to the topic/idea and audience.

          Output Structure:

          FORMAT RECOMMENDATION
          Type (Single/Carousel)
          Rationale for choice
          Dimensions
          • Desktop optimization
          • Mobile optimization
          Visual-to-text ratio
          LAYOUT SPECIFICATION
          Content zones (Top/Middle/Bottom)
          White space requirements
          Engagement elements placement
          Mobile preview considerations
          Scroll-stop elements
          COPY FRAMEWORK
          Primary headline (character count)
          Supporting text placement
          CTA positioning
          Key information hierarchy
          Constraints:
          EXCLUDE:

          Visual design elements
          Brand guidelines
          Technical specifications
          Marketing strategy
          INCLUDE:

          Platform-specific requirements
          Engagement optimization
          Accessibility considerations
          Professional credibility markers
          Example Input:
          "🎯 Your next team member won't be an AI yet, but your data governance better be ready for it.
          [Event details]"

          Example Output:

          FORMAT
          Type: Single image
          Rationale: Single powerful message, event focus
          Dimensions: 1200x627px (LinkedIn optimal)
          Ratio: 60% visual space, 40% text elements

          LAYOUT
          Zone 1 (Top 30%): Thought-provoking headline
          Zone 2 (Middle 40%): Event value proposition
          Zone 3 (Bottom 30%): Event details + CTA
          Mobile Preview: Critical text within center 80%

          COPY PLACEMENT
          Headline: "Future-Proof Your Data Team" (Top)
          Supporting: "Exclusive roundtable with 30 leaders" (Middle)
          Details: "April 24th | Antwerp" (Bottom)
          CTA: "Limited seats - Register now" (Bottom right)`;
      }
      
      // Add the actual content at the end
      prompt += `\n\nHere is the topic/idea we want to write about/convey:\n${content}`;
      
      const response = await anthropic.messages.create({
        model: "claude-3-7-sonnet-20250219", // Using a current available model
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }]
      });
      
      return response.content[0].text || 'No response from API';
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.message || 'Failed to remix content');
    }
  }
}; 